import {
  AreaState,
  Coordinate,
  LocationType,
  Polygon,
  SearchStatus,
} from "@/types";
import { useCallback, useState } from "react";

interface OpenStreetMapArea {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: number[];
  geojson: {
    type: string;
    coordinates: any[];
  };
}

interface UseAreaSearchReturn {
  searchTerm: string;
  searchStatus: SearchStatus;
  searchResults: AreaState[] | null;
  setSearchTerm: (searchTerm: string) => void;
  reset: () => void;
}

function getPolygons(array: any[]): Polygon[] {
  let polygons: Polygon[] = [];

  for (const item of array) {
    if (typeof item[0][0] === "number") {
      const coordinates = item.map(
        (point: number[]): Coordinate => ({
          lat: point[1],
          lng: point[0],
        }),
      );

      polygons.push({
        id: crypto.randomUUID(),
        coordinates,
      });
    } else {
      const subPolygons = getPolygons(item);
      polygons.push(...subPolygons);
    }
  }

  return polygons;
}

function parseOpenStreetMapArea(
  openStreetMapArea: OpenStreetMapArea,
): AreaState {
  const polygons = getPolygons(openStreetMapArea.geojson.coordinates);
  const boundingBox = {
    south: Number(openStreetMapArea.boundingbox[0]),
    north: Number(openStreetMapArea.boundingbox[1]),
    west: Number(openStreetMapArea.boundingbox[2]),
    east: Number(openStreetMapArea.boundingbox[3]),
  };

  return {
    locationType: LocationType.Area,
    placeId: openStreetMapArea.place_id,
    displayName: openStreetMapArea.name,
    fullName: openStreetMapArea.display_name,
    open: false,
    polygons,
    bounds: boundingBox,
    sublocations: [],
  };
}

export default function useAreaSearch(): UseAreaSearchReturn {
  const [internalSearchTerm, setInternalSearchTerm] = useState<string>("");
  const [internalSearchStatus, setInternalSearchStatus] =
    useState<SearchStatus>(SearchStatus.Searched);
  const [internalSearchResults, setInternalSearchResults] = useState<
    AreaState[] | null
  >(null);

  const fetchSearchResults = useCallback(async (searchTerm: string) => {
    setInternalSearchTerm(searchTerm);
    setInternalSearchStatus(SearchStatus.Searching);

    const url = `/api/search-areas?query=${searchTerm}`;
    const response = await fetch(url);
    const openStreetMapAreas = (await response.json()) as OpenStreetMapArea[];

    const searchResults = openStreetMapAreas
      .map((openStreetMapArea) => {
        try {
          return parseOpenStreetMapArea(openStreetMapArea);
        } catch {
          return null;
        }
      })
      .filter(
        (searchResult): searchResult is AreaState => searchResult !== null,
      );

    console.log(searchResults);
    setInternalSearchResults(searchResults);
    setInternalSearchStatus(SearchStatus.Searched);
  }, []);

  const setSearchTerm = useCallback(
    (searchTerm: string) => {
      setInternalSearchTerm(searchTerm);
      fetchSearchResults(searchTerm);
    },
    [fetchSearchResults],
  );

  const reset = useCallback(() => {
    setInternalSearchTerm("");
    setInternalSearchStatus(SearchStatus.Searched);
    setInternalSearchResults(null);
  }, []);

  return {
    searchTerm: internalSearchTerm,
    searchStatus: internalSearchStatus,
    searchResults: internalSearchResults,
    setSearchTerm,
    reset,
  };
}
