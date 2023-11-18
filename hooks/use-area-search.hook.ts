import {
  AreaState,
  LocationType,
  PointState,
  SearchStatus,
  TreeState,
  OpenStreetMapResponseItem,
} from "@/types";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { MultiPolygon, Point, Polygon, Position } from "geojson";
import { useCallback, useState } from "react";

interface UseAreaSearchReturn {
  searchTerm: string;
  searchStatus: SearchStatus;
  searchResults: AreaState[] | null;
  setSearchTerm: (searchTerm: string) => void;
  reset: () => void;
}

export default function useAreaSearch(
  parent: TreeState | AreaState,
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

    if (parent.locationType === LocationType.Area) {
      const { south, north, west, east } = parent.bounds;
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
          console.log(
            "openStreetMapResponseItem.geoJson is not Polygon or MultiPolygon",
          );
          return null;
        }

        const geojson = openStreetMapResponseItem.geojson;

        let polygon: Polygon | MultiPolygon;

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
                console.log("foo");
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
                  console.log("bar");
                  return null;
                }
              }
            }
          }
        } else {
          console.log("baz");
          return null;
        }

        const bounds: google.maps.LatLngBoundsLiteral = {
          south: Number(openStreetMapResponseItem.boundingbox[0]),
          north: Number(openStreetMapResponseItem.boundingbox[1]),
          west: Number(openStreetMapResponseItem.boundingbox[2]),
          east: Number(openStreetMapResponseItem.boundingbox[3]),
        };

        return {
          parent: parent,
          locationType: LocationType.Area,
          placeId: openStreetMapResponseItem.place_id,
          displayName: openStreetMapResponseItem.name,
          fullName: openStreetMapResponseItem.display_name,
          open: false,
          polygon,
          bounds,
          sublocations: [] as (AreaState | PointState)[],
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
