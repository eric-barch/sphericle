import { useAllFeatures } from "@/components/all-features-provider";
import {
  isAreaState,
  isParentFeatureState,
  isRootState,
} from "@/helpers/feature-type-guards";
import {
  AreaState,
  FeatureType,
  OsmItem,
  ParentFeatureState,
  RootState,
  SearchStatus,
} from "@/types";
import booleanIntersects from "@turf/boolean-intersects";
import { AllGeoJSON } from "@turf/helpers";
import { MultiPolygon, Polygon } from "geojson";
import { useCallback, useEffect, useState } from "react";

export interface AreaSearch {
  term: string;
  status: SearchStatus;
  results: AreaState[];
  setTerm: (searchTerm: string) => void;
  reset: () => void;
}

export default function useAreaSearch(parentFeatureId: string): AreaSearch {
  const { allFeatures } = useAllFeatures();

  const [parentFeatureState, setParentFeatureState] =
    useState<ParentFeatureState>(() => {
      const initialParentFeatureState = allFeatures.get(parentFeatureId);

      if (
        !initialParentFeatureState ||
        !isParentFeatureState(initialParentFeatureState)
      ) {
        return null;
      }

      return initialParentFeatureState;
    });
  const [internalSearchTerm, setInternalSearchTerm] = useState<string>("");
  const [internalSearchStatus, setInternalSearchStatus] =
    useState<SearchStatus>(SearchStatus.SEARCHED);
  const [internalSearchResults, setInternalSearchResults] = useState<
    AreaState[]
  >([]);

  useEffect(() => {
    const initialParentFeatureState = allFeatures.get(parentFeatureId);

    if (!isParentFeatureState(initialParentFeatureState)) {
      return;
    }

    setParentFeatureState(initialParentFeatureState);
  }, [allFeatures, parentFeatureId]);

  const fetchSearchResults = useCallback(
    async (searchTerm: string) => {
      setInternalSearchTerm(searchTerm);
      setInternalSearchStatus(SearchStatus.SEARCHING);

      let query: string = searchTerm;

      if (isAreaState(parentFeatureState)) {
        const { south, north, west, east } = parentFeatureState.searchBounds;
        query = query + `&viewbox=${west},${south},${east},${north}&bounded=1`;
      }

      const response = (await (
        await fetch(`/api/search-open-street-map?query=${query}`)
      ).json()) as OsmItem[];

      const searchResults = response
        .map((osmItem) => getAreaState(parentFeatureState, osmItem))
        .filter((searchResult) => searchResult !== null);

      setInternalSearchResults(searchResults);
      setInternalSearchStatus(SearchStatus.SEARCHED);
    },
    [parentFeatureState],
  );

  const setTerm = useCallback(
    (searchTerm: string) => {
      setInternalSearchTerm(searchTerm);
      if (searchTerm !== "") {
        fetchSearchResults(searchTerm);
      }
    },
    [fetchSearchResults],
  );

  const reset = useCallback(() => {
    setInternalSearchTerm("");
    setInternalSearchStatus(SearchStatus.SEARCHED);
    setInternalSearchResults([]);
  }, []);

  return {
    term: internalSearchTerm,
    status: internalSearchStatus,
    results: internalSearchResults,
    setTerm,
    reset,
  };
}

function getAreaState(
  parentFeature: ParentFeatureState,
  osmItem: OsmItem,
): AreaState | null {
  const polygons = getPolygons(parentFeature, osmItem);
  const searchBounds = getSearchBounds(osmItem);
  const displayBounds = getDisplayBounds(polygons, searchBounds);

  return {
    featureId: crypto.randomUUID(),
    parentFeatureId: parentFeature.featureId,
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
}

function getPolygons(
  parentFeature: ParentFeatureState,
  osmItem: OsmItem,
): Polygon | MultiPolygon | null {
  const polygons = osmItem.geojson;

  if (!isPolygon(polygons) && !isMultiPolygon(polygons)) {
    return null;
  }

  if (isRootState(parentFeature)) {
    return polygons;
  }

  if (isAreaState(parentFeature)) {
    const parentPolygons = parentFeature.polygons;

    if (booleanIntersects(polygons, parentPolygons)) {
      return polygons;
    }
  }

  return null;
}

function getSearchBounds(osmItem: OsmItem): google.maps.LatLngBoundsLiteral {
  return {
    south: Number(osmItem.boundingbox[0]),
    north: Number(osmItem.boundingbox[1]),
    west: Number(osmItem.boundingbox[2]),
    east: Number(osmItem.boundingbox[3]),
  };
}

function getDisplayBounds(
  polygons: Polygon | MultiPolygon,
  searchBounds: google.maps.LatLngBoundsLiteral,
): google.maps.LatLngBoundsLiteral {
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
}

function isPolygon(geoJson: AllGeoJSON): geoJson is Polygon {
  return geoJson.type === "Polygon";
}

function isMultiPolygon(geoJson: AllGeoJSON): geoJson is MultiPolygon {
  return geoJson.type === "MultiPolygon";
}
