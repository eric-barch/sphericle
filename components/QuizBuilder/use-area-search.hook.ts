import { useAllFeatures } from "@/components/AllFeaturesProvider";
import {
  AreaState,
  FeatureType,
  OsmItem,
  RootState,
  SearchStatus,
} from "@/types";
import booleanIntersects from "@turf/boolean-intersects";
import { AllGeoJSON } from "@turf/helpers";
import { MultiPolygon, Polygon } from "geojson";
import { useCallback, useState } from "react";

export interface AreaSearch {
  term: string;
  status: SearchStatus;
  results: AreaState[];
  setTerm: (searchTerm: string) => void;
  reset: () => void;
}

export default function useAreaSearch(parentFeatureId: string): AreaSearch {
  const { allFeatures } = useAllFeatures();

  const parentFeature = allFeatures.get(parentFeatureId);

  if (
    parentFeature.featureType !== FeatureType.ROOT &&
    parentFeature.featureType !== FeatureType.AREA
  ) {
    throw new Error("parentFeature must be of type ROOT or AREA.");
  }

  const [internalSearchTerm, setInternalSearchTerm] = useState<string>("");
  const [internalSearchStatus, setInternalSearchStatus] =
    useState<SearchStatus>(SearchStatus.SEARCHED);
  const [internalSearchResults, setInternalSearchResults] = useState<
    AreaState[]
  >([]);

  const fetchSearchResults = useCallback(
    async (searchTerm: string) => {
      setInternalSearchTerm(searchTerm);
      setInternalSearchStatus(SearchStatus.SEARCHING);

      let query: string = searchTerm;

      if (parentFeature.featureType === FeatureType.AREA) {
        const { south, north, west, east } = parentFeature.searchBounds;
        query = query + `&viewbox=${west},${south},${east},${north}&bounded=1`;
      }

      const response = (await (
        await fetch(`/api/search-open-street-map?query=${query}`)
      ).json()) as OsmItem[];

      const searchResults = response
        .map((osmItem) => getAreaState(parentFeature, osmItem))
        .filter((searchResult) => searchResult !== null);

      setInternalSearchResults(searchResults);
      setInternalSearchStatus(SearchStatus.SEARCHED);
    },
    [parentFeature],
  );

  const setSearchTerm = useCallback(
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
    setTerm: setSearchTerm,
    reset,
  };
}

function getAreaState(
  parentFeature: RootState | AreaState,
  osmItem: OsmItem,
): AreaState | null {
  const polygons = getPolygons(parentFeature, osmItem);
  const searchBounds = getSearchBounds(osmItem);
  const displayBounds = getDisplayBounds(polygons, searchBounds);

  return {
    id: crypto.randomUUID(),
    parentFeatureId: parentFeature.id,
    subfeatureIds: new Set<string>(),
    openStreetMapPlaceId: osmItem.place_id,
    longName: osmItem.display_name,
    shortName: osmItem.name,
    userDefinedName: "",
    featureType: FeatureType.AREA,
    isOpen: false,
    isAdding: true,
    searchBounds,
    displayBounds,
    polygons,
  };
}

function getPolygons(
  parentFeature: RootState | AreaState,
  osmItem: OsmItem,
): Polygon | MultiPolygon | null {
  const polygons = osmItem.geojson;

  if (!isPolygon(polygons) && !isMultiPolygon(polygons)) {
    return null;
  }

  if (parentFeature.featureType === FeatureType.ROOT) {
    return polygons;
  }

  const parentPolygons = parentFeature.polygons;

  if (booleanIntersects(polygons, parentPolygons)) {
    return polygons;
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
