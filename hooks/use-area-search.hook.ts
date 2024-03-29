import { flattenCoordinates, isMultiPolygon, isPolygon } from "@/helpers";
import { isArea, isParent, isEarth } from "@/helpers";
import { useQuiz } from "@/providers";
import {
  AreaSearch,
  AreaState,
  FeatureType,
  OsmResult,
  SearchStatus,
} from "@/types";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { MultiPolygon, Polygon } from "geojson";
import { useState } from "react";

const useAreaSearch = (parentFeatureId: string): AreaSearch => {
  const { quiz } = useQuiz();

  const parentFeatureState = (() => {
    const parentFeatureState = quiz.get(parentFeatureId);

    if (isParent(parentFeatureState)) {
      return parentFeatureState;
    }
  })();

  const [termRaw, setTermRaw] = useState<string>("");
  const [statusRaw, setStatusRaw] = useState<SearchStatus>(
    SearchStatus.SEARCHED,
  );
  const [resultsRaw, setResultsRaw] = useState<AreaState[]>([]);

  const getPolygons = (osmItem: OsmResult): Polygon | MultiPolygon => {
    const geojson = osmItem.geojson;

    if (!isPolygon(geojson) && !isMultiPolygon(geojson)) {
      return;
    }

    if (isEarth(parentFeatureState)) {
      return geojson;
    }

    /**TODO: This is working fine but not perfect. It will sometimes return
     * early. */
    if (isArea(parentFeatureState)) {
      const parentPolygons = parentFeatureState.polygon;
      const coordinates = flattenCoordinates(geojson);

      let attempts = 0;

      while (attempts < 100) {
        const randomCoordinate =
          coordinates[Math.floor(Math.random() * coordinates.length)];

        if (booleanPointInPolygon(randomCoordinate, parentPolygons)) {
          return geojson;
        }

        attempts++;
      }
    }
  };

  const getDisplayBounds = (
    polygons: Polygon | MultiPolygon,
    searchBounds: google.maps.LatLngBoundsLiteral,
  ): google.maps.LatLngBoundsLiteral => {
    let maxGap = 0;
    let maxGapStart = 0;
    let maxGapEnd = 0;

    const longitudes = flattenCoordinates(polygons)
      .map((coord) => coord[0])
      .sort((a, b) => a - b);

    for (let i = 0; i < longitudes.length - 1; i++) {
      const gap = longitudes[i + 1] - longitudes[i];
      if (gap > maxGap) {
        maxGap = gap;
        maxGapStart = longitudes[i];
        maxGapEnd = longitudes[i + 1];
      }
    }

    const antiMeridianGap =
      longitudes[0] + 180 + (180 - longitudes[longitudes.length - 1]);

    if (antiMeridianGap > maxGap) {
      return searchBounds;
    } else {
      return {
        north: searchBounds.north,
        east: maxGapStart,
        south: searchBounds.south,
        west: maxGapEnd,
      };
    }
  };

  const toAreaState = (osmItem: OsmResult): AreaState => {
    const polygons = getPolygons(osmItem);

    if (!polygons) {
      return;
    }

    const searchBounds = {
      south: Number(osmItem.boundingbox[0]),
      north: Number(osmItem.boundingbox[1]),
      west: Number(osmItem.boundingbox[2]),
      east: Number(osmItem.boundingbox[3]),
    };

    const displayBounds = getDisplayBounds(polygons, searchBounds);

    return {
      id: crypto.randomUUID(),
      parentId: parentFeatureId,
      childIds: new Set<string>(),
      osmId: osmItem.place_id,
      longName: osmItem.display_name,
      shortName: osmItem.name,
      userDefinedName: null,
      type: FeatureType.AREA,
      polygon: polygons,
      searchBounds,
      displayBounds,
    };
  };

  const search = async (searchTerm: string) => {
    setTermRaw(searchTerm);
    setStatusRaw(SearchStatus.SEARCHING);

    let query = searchTerm;

    if (isArea(parentFeatureState)) {
      const { south, north, west, east } = parentFeatureState.searchBounds;
      query = query + `&viewbox=${west},${south},${east},${north}&bounded=1`;
    }

    const response = (await (
      await fetch(`/api/search-open-street-map?query=${query}`)
    ).json()) as OsmResult[];

    const results = response
      .map((osmItem) => toAreaState(osmItem))
      .filter((searchResult) => searchResult);

    setResultsRaw(results);
    setStatusRaw(SearchStatus.SEARCHED);
  };

  const setTerm = (searchTerm: string) => {
    if (searchTerm === "") {
      reset();
      return;
    }

    search(searchTerm);
  };

  const reset = () => {
    setTermRaw("");
    setStatusRaw(SearchStatus.SEARCHED);
    setResultsRaw([]);
  };

  return {
    term: termRaw,
    status: statusRaw,
    results: resultsRaw,
    setTerm,
    reset,
  };
};

export { useAreaSearch };
