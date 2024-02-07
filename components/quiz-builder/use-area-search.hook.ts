import { useAllFeatures } from "@/components/quiz-provider";
import {
  flattenCoordinates,
  isMultiPolygon,
  isPolygon,
} from "@/helpers/geojson.helpers";
import {
  isAreaState,
  isParentFeatureState,
  isRootState,
} from "@/helpers/state.helpers";
import {
  AreaSearch,
  AreaState,
  FeatureType,
  OsmItem,
  SearchStatus,
} from "@/types";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { MultiPolygon, Polygon } from "geojson";
import { useState } from "react";

function useAreaSearch(parentFeatureId: string): AreaSearch {
  const { allFeatures } = useAllFeatures();

  const parentFeatureState = (() => {
    const parentFeatureState = allFeatures.get(parentFeatureId);

    if (isParentFeatureState(parentFeatureState)) {
      return parentFeatureState;
    }
  })();

  const [termRaw, setTermRaw] = useState<string>("");
  const [statusRaw, setStatusRaw] = useState<SearchStatus>(
    SearchStatus.SEARCHED,
  );
  const [resultsRaw, setResultsRaw] = useState<AreaState[]>([]);

  const getPolygons = (osmItem: OsmItem): Polygon | MultiPolygon => {
    const geojson = osmItem.geojson;

    if (!isPolygon(geojson) && !isMultiPolygon(geojson)) {
      return;
    }

    if (isRootState(parentFeatureState)) {
      return geojson;
    }

    /**TODO: This is causing noticeable UI lag. Need to do a time complexity
     * deep dive. */
    if (isAreaState(parentFeatureState)) {
      const parentPolygons = parentFeatureState.polygons;
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

  const toAreaState = (osmItem: OsmItem): AreaState => {
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
      featureId: crypto.randomUUID(),
      parentFeatureId,
      subfeatureIds: new Set<string>(),
      openStreetMapPlaceId: osmItem.place_id,
      longName: osmItem.display_name,
      shortName: osmItem.name,
      userDefinedName: null,
      featureType: FeatureType.AREA,
      polygons,
      searchBounds,
      displayBounds,
    };
  };

  const search = async (searchTerm: string) => {
    setTermRaw(searchTerm);
    setStatusRaw(SearchStatus.SEARCHING);

    let query = searchTerm;

    if (isAreaState(parentFeatureState)) {
      const { south, north, west, east } = parentFeatureState.searchBounds;
      query = query + `&viewbox=${west},${south},${east},${north}&bounded=1`;
    }

    const response = (await (
      await fetch(`/api/search-open-street-map?query=${query}`)
    ).json()) as OsmItem[];

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
}

export { useAreaSearch };
