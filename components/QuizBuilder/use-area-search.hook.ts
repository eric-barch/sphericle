import {
  AreaState,
  LocationType,
  OpenStreetMapResponseItem,
  PointState,
  Quiz,
  SearchStatus,
} from "@/types";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { MultiPolygon, Point, Polygon, Position } from "geojson";
import { useCallback, useState } from "react";

export interface AreaSearch {
  term: string;
  status: SearchStatus;
  results: AreaState[];
  setTerm: (searchTerm: string) => void;
  reset: () => void;
}

export default function useAreaSearch(parent: Quiz | AreaState): AreaSearch {
  const [internalSearchTerm, setInternalSearchTerm] = useState<string>("");
  const [internalSearchStatus, setInternalSearchStatus] =
    useState<SearchStatus>(SearchStatus.Searched);
  const [internalSearchResults, setInternalSearchResults] = useState<
    AreaState[]
  >([]);

  const fetchSearchResults = useCallback(async (searchTerm: string) => {
    setInternalSearchTerm(searchTerm);
    setInternalSearchStatus(SearchStatus.Searching);

    let query = searchTerm;

    if (parent.locationType === LocationType.Area) {
      const { south, north, west, east } = parent.searchBounds;
      query = `${searchTerm}&viewbox=${west},${south},${east},${north}&bounded=1`;
    }

    const url = `/api/search-areas?query=${query}`;
    const response = await fetch(url);

    const openStreetMapResponse =
      (await response.json()) as OpenStreetMapResponseItem[];

    const searchResults = openStreetMapResponse
      .map((openStreetMapResponseItem): AreaState | null => {
        if (
          openStreetMapResponseItem.geojson.type !== "Polygon" &&
          openStreetMapResponseItem.geojson.type !== "MultiPolygon"
        ) {
          return null;
        }

        const geojson = openStreetMapResponseItem.geojson;

        let polygon: Polygon | MultiPolygon;

        // check if within bounds
        if (geojson.type === "Polygon") {
          polygon = {
            type: "Polygon",
            coordinates: geojson.coordinates as Position[][],
          };

          for (const coordinate of polygon.coordinates) {
            for (const position of coordinate) {
              const point: Point = {
                type: "Point",
                coordinates: position,
              };

              if (
                parent.locationType === LocationType.Area &&
                !booleanPointInPolygon(point, parent.polygon)
              ) {
                return null;
              }
            }
          }
        } else if (geojson.type === "MultiPolygon") {
          polygon = {
            type: "MultiPolygon",
            coordinates: geojson.coordinates as Position[][][],
          };

          for (const polygonCoordinates of polygon.coordinates) {
            for (const coordinate of polygonCoordinates) {
              for (const position of coordinate) {
                const point: Point = {
                  type: "Point",
                  coordinates: position,
                };

                if (
                  parent.locationType === LocationType.Area &&
                  !booleanPointInPolygon(point, parent.polygon)
                ) {
                  return null;
                }
              }
            }
          }
        }

        const searchBounds: google.maps.LatLngBoundsLiteral = {
          south: Number(openStreetMapResponseItem.boundingbox[0]),
          north: Number(openStreetMapResponseItem.boundingbox[1]),
          west: Number(openStreetMapResponseItem.boundingbox[2]),
          east: Number(openStreetMapResponseItem.boundingbox[3]),
        };

        let longitudes: number[] = [];

        if (polygon.type === "Polygon") {
          longitudes = polygon.coordinates[0]
            .map((coord) => coord[0])
            .sort((a, b) => a - b);
        } else if (polygon.type === "MultiPolygon") {
          longitudes = polygon.coordinates
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

        let displayBounds: google.maps.LatLngBoundsLiteral;

        if (antiMeridianGap > maxGap) {
          displayBounds = searchBounds;
        } else {
          displayBounds = {
            north: searchBounds.north,
            east: maxGapWest,
            south: searchBounds.south,
            west: maxGapEast,
          };
        }

        return {
          id: crypto.randomUUID(),
          openStreetMapPlaceId: openStreetMapResponseItem.place_id,
          locationType: LocationType.Area,
          shortName: openStreetMapResponseItem.name,
          longName: openStreetMapResponseItem.display_name,
          userDefinedName: "",
          isRenaming: false,
          isOpen: false,
          isAdding: false,
          polygon,
          displayBounds,
          searchBounds,
          sublocations: [] as (AreaState | PointState)[],
          answeredCorrectly: null,
        };
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
      if (searchTerm !== "") {
        fetchSearchResults(searchTerm);
      }
    },
    [fetchSearchResults],
  );

  const reset = useCallback(() => {
    setInternalSearchTerm("");
    setInternalSearchStatus(SearchStatus.Searched);
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
