import { useQuiz } from "@/components/QuizProvider";
import {
  AreaState,
  LocationType,
  OpenStreetMapResponseItem,
  SearchStatus,
} from "@/types";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { MultiPolygon, Point, Polygon, Position } from "geojson";
import { useCallback, useState } from "react";

// TODO: refactor

export interface AreaSearch {
  term: string;
  status: SearchStatus;
  results: AreaState[];
  setTerm: (searchTerm: string) => void;
  reset: () => void;
}

export default function useAreaSearch(parentId: string): AreaSearch {
  const quiz = useQuiz();
  const parentLocation = quiz.locations[parentId];

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

      let query = searchTerm;

      if (parentLocation.locationType === LocationType.AREA) {
        const { south, north, west, east } = parentLocation.bounds;
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

          let polygons: Polygon | MultiPolygon;

          // check if within bounds
          if (geojson.type === "Polygon") {
            polygons = {
              type: "Polygon",
              coordinates: geojson.coordinates as Position[][],
            };

            for (const coordinate of polygons.coordinates) {
              for (const position of coordinate) {
                const point: Point = {
                  type: "Point",
                  coordinates: position,
                };

                if (
                  parentLocation.locationType === LocationType.AREA &&
                  !booleanPointInPolygon(point, parentLocation.polygons)
                ) {
                  return null;
                }
              }
            }
          } else if (geojson.type === "MultiPolygon") {
            polygons = {
              type: "MultiPolygon",
              coordinates: geojson.coordinates as Position[][][],
            };

            for (const polygonCoordinates of polygons.coordinates) {
              for (const coordinate of polygonCoordinates) {
                for (const position of coordinate) {
                  const point: Point = {
                    type: "Point",
                    coordinates: position,
                  };

                  if (
                    parentLocation.locationType === LocationType.AREA &&
                    !booleanPointInPolygon(point, parentLocation.polygons)
                  ) {
                    return null;
                  }
                }
              }
            }
          }

          let bounds: google.maps.LatLngBoundsLiteral = {
            south: Number(openStreetMapResponseItem.boundingbox[0]),
            north: Number(openStreetMapResponseItem.boundingbox[1]),
            west: Number(openStreetMapResponseItem.boundingbox[2]),
            east: Number(openStreetMapResponseItem.boundingbox[3]),
          };

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
            bounds = bounds;
          } else {
            bounds = {
              north: bounds.north,
              east: maxGapWest,
              south: bounds.south,
              west: maxGapEast,
            };
          }

          return {
            id: crypto.randomUUID(),
            parentId,
            openStreetMapPlaceId: openStreetMapResponseItem.place_id,
            locationType: LocationType.AREA,
            shortName: openStreetMapResponseItem.name,
            longName: openStreetMapResponseItem.display_name,
            userDefinedName: "",
            isOpen: false,
            isAdding: true,
            polygons,
            bounds,
            sublocationIds: [],
            answeredCorrectly: null,
          };
        })
        .filter(
          (searchResult): searchResult is AreaState => searchResult !== null,
        );

      setInternalSearchResults(searchResults);
      setInternalSearchStatus(SearchStatus.SEARCHED);
    },
    [parentId, parentLocation],
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
