import { useAllFeatures } from "@/components/all-features-provider";
import {
  isAreaState,
  isParentFeatureState,
  isRootState,
  isPolygon,
  isMultiPolygon,
} from "@/helpers/type-guards";
import {
  AreaSearch,
  AreaState,
  FeatureType,
  OsmItem,
  SearchStatus,
} from "@/types";
import booleanIntersects from "@turf/boolean-intersects";
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
    const polygons = osmItem.geojson;

    if (!isPolygon(polygons) && !isMultiPolygon(polygons)) {
      return null;
    }

    if (isRootState(parentFeatureState)) {
      return polygons;
    }

    if (isAreaState(parentFeatureState)) {
      const parentPolygons = parentFeatureState.polygons;

      if (booleanIntersects(polygons, parentPolygons)) {
        return polygons;
      }
    }

    return null;
  };

  const getSearchBounds = (
    osmItem: OsmItem,
  ): google.maps.LatLngBoundsLiteral => {
    return {
      south: Number(osmItem.boundingbox[0]),
      north: Number(osmItem.boundingbox[1]),
      west: Number(osmItem.boundingbox[2]),
      east: Number(osmItem.boundingbox[3]),
    };
  };

  const getDisplayBounds = (
    polygons: Polygon | MultiPolygon,
    searchBounds: google.maps.LatLngBoundsLiteral,
  ): google.maps.LatLngBoundsLiteral => {
    let longitudes: number[] = [];

    if (polygons.type === "Polygon") {
      longitudes = polygons.coordinates[0]
        .map((coord) => coord[0])
        .sort((a, b) => a - b);
    } else if (polygons.type === "MultiPolygon") {
      longitudes = polygons.coordinates
        .flat(2)
        .map((coord) => coord[0])
        .sort((a, b) => a - b);
    }

    let maxGap = 0;
    let maxGapWest = 0;
    let maxGapEast = 0;

    for (let i = 0; i < longitudes.length; i++) {
      const longitude = longitudes[i];
      const nextLongitude = longitudes[i + 1];
      const gap = nextLongitude - longitude;
      if (gap > maxGap) {
        maxGap = gap;
        maxGapWest = longitude;
        maxGapEast = nextLongitude;
      }
    }

    const westAntimeridianGap = longitudes[0] - -180;
    const eastAntimeridianGap = 180 - longitudes[longitudes.length - 1];
    const antiMeridianGap = westAntimeridianGap + eastAntimeridianGap;

    if (antiMeridianGap > maxGap) {
      return searchBounds;
    } else {
      return {
        north: searchBounds.north,
        east: maxGapWest,
        south: searchBounds.south,
        west: maxGapEast,
      };
    }
  };

  const toAreaState = (osmItem: OsmItem): AreaState => {
    const polygons = getPolygons(osmItem);
    const searchBounds = getSearchBounds(osmItem);
    const displayBounds = getDisplayBounds(polygons, searchBounds);

    return {
      featureId: crypto.randomUUID(),
      parentFeatureId,
      subfeatureIds: new Set<string>(),
      openStreetMapPlaceId: osmItem.place_id,
      longName: osmItem.display_name,
      shortName: osmItem.name,
      userDefinedName: "",
      featureType: FeatureType.AREA,
      searchBounds,
      displayBounds,
      polygons,
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
