import {
  AreaState,
  Bounds,
  Coordinate,
  LocationType,
  PointState,
  Polygon,
  SearchStatus,
  TreeState,
} from "@/types";
import { useCallback, useState } from "react";

interface OpenStreetMapResponseItem {
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
      const coordinates = item.map((point: number[]) => ({
        lat: point[1],
        lng: point[0],
      }));

      polygons.push(new Polygon(crypto.randomUUID(), coordinates));
    } else {
      const subPolygons = getPolygons(item);
      polygons.push(...subPolygons);
    }
  }

  return polygons;
}

function isPolygonInParentPolygons(
  polygon: Polygon,
  parentPolygons: Polygon[],
): boolean {
  for (const coordinate of polygon.coordinates) {
    const point = new google.maps.LatLng(coordinate.lat, coordinate.lng);
    if (
      !parentPolygons.some((parentPolygon) => {
        const googlePolygon = new google.maps.Polygon({
          paths: parentPolygon.coordinates,
        });
        return google.maps.geometry.poly.containsLocation(point, googlePolygon);
      })
    ) {
      return false;
    }
  }
  return true;
}

export default function useAreaSearch(
  parentLocation: TreeState | AreaState,
): UseAreaSearchReturn {
  const [internalSearchTerm, setInternalSearchTerm] = useState<string>("");
  const [internalSearchStatus, setInternalSearchStatus] =
    useState<SearchStatus>(SearchStatus.Searched);
  const [internalSearchResults, setInternalSearchResults] = useState<
    AreaState[] | null
  >(null);

  const fetchSearchResults = useCallback(async (searchTerm: string) => {
    setInternalSearchTerm(searchTerm);
    setInternalSearchStatus(SearchStatus.Searching);

    let query = searchTerm;

    if (parentLocation.locationType === LocationType.Area) {
      const { south, north, west, east } = parentLocation.bounds;
      query =
        searchTerm + `&viewbox=${west},${south},${east},${north}&bounded=1`;
    }

    const url = `/api/search-areas?query=${query}`;
    const response = await fetch(url);
    const openStreetMapAreas =
      (await response.json()) as OpenStreetMapResponseItem[];

    const searchResults = openStreetMapAreas
      .map((openStreetMapArea) => {
        try {
          const polygons = getPolygons(openStreetMapArea.geojson.coordinates);

          if (parentLocation.locationType === LocationType.Area) {
            const allPolygonsInParentPolygons = polygons.every((polygon) =>
              isPolygonInParentPolygons(polygon, parentLocation.polygons),
            );

            if (!allPolygonsInParentPolygons) {
              return null;
            }
          }

          const bounds: Bounds = {
            south: Number(openStreetMapArea.boundingbox[0]),
            north: Number(openStreetMapArea.boundingbox[1]),
            west: Number(openStreetMapArea.boundingbox[2]),
            east: Number(openStreetMapArea.boundingbox[3]),
          };

          return {
            parent: parentLocation,
            locationType: LocationType.Area,
            placeId: openStreetMapArea.place_id,
            displayName: openStreetMapArea.name,
            fullName: openStreetMapArea.display_name,
            open: false,
            polygons,
            bounds,
            sublocations: [] as (AreaState | PointState)[],
          };
        } catch {
          return null;
        }
      })
      .filter(
        (searchResult): searchResult is AreaState => searchResult !== null,
      );

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
