import { useQuiz } from "@/components/QuizProvider";
import {
  AreaState,
  LocationType,
  OsmItem,
  RootState,
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

export default function useAreaSearch(parentId: string): AreaSearch {
  const quiz = useQuiz();
  const parentLocation = quiz.locations[parentId] as RootState | AreaState;

  if (
    parentLocation.locationType !== LocationType.ROOT &&
    parentLocation.locationType !== LocationType.AREA
  ) {
    throw new Error("parentLocation must be of type ROOT or AREA.");
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

      let query: string = "";

      if (parentLocation.locationType === LocationType.ROOT) {
        query = searchTerm;
      } else if (parentLocation.locationType === LocationType.AREA) {
        const { south, north, west, east } = parentLocation.searchBounds;
        query = `${searchTerm}&viewbox=${west},${south},${east},${north}&bounded=1`;
      }

      const rawResponse = await fetch(
        `/api/search-open-street-map?query=${query}`,
      );
      const jsonResponse = (await rawResponse.json()) as OsmItem[];

      const areaStates = jsonResponse
        .map((osmItem): AreaState | null => {
          if (
            osmItem.geojson.type !== "Polygon" &&
            osmItem.geojson.type !== "MultiPolygon"
          ) {
            return null;
          }

          let polygons: Polygon | MultiPolygon;

          if (parentLocation.locationType === LocationType.ROOT) {
            polygons = osmItem.geojson as Polygon | MultiPolygon;
          }

          if (parentLocation.locationType === LocationType.AREA) {
            if (osmItem.geojson.type === "Polygon") {
              polygons = osmItem.geojson as Polygon;

              for (const linearRing of polygons.coordinates) {
                for (const position of linearRing) {
                  if (
                    !booleanPointInPolygon(position, parentLocation.polygons)
                  ) {
                    return null;
                  }
                }
              }
            }

            if (osmItem.geojson.type === "MultiPolygon") {
              polygons = osmItem.geojson as MultiPolygon;

              for (const polygon of polygons.coordinates) {
                for (const linearRing of polygon) {
                  for (const position of linearRing) {
                    if (
                      !booleanPointInPolygon(position, parentLocation.polygons)
                    ) {
                      return null;
                    }
                  }
                }
              }
            }
          }

          const searchBounds: google.maps.LatLngBoundsLiteral = {
            south: Number(osmItem.boundingbox[0]),
            north: Number(osmItem.boundingbox[1]),
            west: Number(osmItem.boundingbox[2]),
            east: Number(osmItem.boundingbox[3]),
          };

          let displayBounds = searchBounds;

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
            displayBounds = displayBounds;
          } else {
            displayBounds = {
              north: displayBounds.north,
              east: maxGapWest,
              south: displayBounds.south,
              west: maxGapEast,
            };
          }

          return {
            id: crypto.randomUUID(),
            parentId,
            openStreetMapPlaceId: osmItem.place_id,
            locationType: LocationType.AREA,
            shortName: osmItem.name,
            longName: osmItem.display_name,
            userDefinedName: "",
            isOpen: false,
            isAdding: true,
            polygons,
            searchBounds,
            displayBounds,
            sublocationIds: [],
            answeredCorrectly: null,
          };
        })
        .filter(
          (searchResult): searchResult is AreaState => searchResult !== null,
        );

      setInternalSearchResults(areaStates);
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
