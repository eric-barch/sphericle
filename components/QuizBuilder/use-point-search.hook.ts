import { useQuiz } from "@/components/QuizProvider";
import {
  AreaState,
  LocationType,
  PointState,
  RootState,
  SearchStatus,
} from "@/types";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { Point } from "geojson";
import { useCallback, useEffect, useRef, useState } from "react";

export interface PointSearch {
  term: string;
  status: SearchStatus;
  results: PointState[];
  setTerm: (searchTerm: string) => void;
  reset: () => void;
}

export default function usePointSearch(parentId: string): PointSearch {
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
    PointState[]
  >([]);

  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService>();
  const geocoderRef = useRef<google.maps.Geocoder>();

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const fetchSearchResults = useCallback(
    async (searchTerm: string) => {
      setInternalSearchTerm(searchTerm);
      setInternalSearchStatus(SearchStatus.SEARCHING);

      if (!autocompleteServiceRef.current) {
        throw new Error("Did not find autocompleteServiceRef.");
      }

      let request: {
        input: string;
        locationRestriction?: google.maps.LatLngBoundsLiteral;
      } = {
        input: searchTerm,
      };

      if (parentLocation.locationType === LocationType.AREA) {
        request.locationRestriction = parentLocation.bounds;
      }

      const autocompletePredictions = (
        await autocompleteServiceRef.current.getPlacePredictions(request)
      ).predictions;

      const searchResults = (
        await Promise.all(
          autocompletePredictions.map(
            async (autocompletePrediction): Promise<PointState | null> => {
              if (!geocoderRef.current) {
                return null;
              }

              const geocoderResult = (
                await geocoderRef.current.geocode({
                  placeId: autocompletePrediction.place_id,
                })
              ).results[0];

              const lat = geocoderResult.geometry.location.lat();
              const lng = geocoderResult.geometry.location.lng();
              const point: Point = { type: "Point", coordinates: [lng, lat] };

              const bounds = {
                north: lat + 0.1,
                south: lat - 0.1,
                east: lng + 0.1,
                west: lng - 0.1,
              };

              const pointState = {
                id: crypto.randomUUID(),
                parentId,
                googlePlacesId: autocompletePrediction.place_id,
                locationType: LocationType.POINT as LocationType.POINT,
                longName: autocompletePrediction.description,
                shortName: autocompletePrediction.description,
                isRenaming: false,
                userDefinedName: "",
                point,
                bounds,
                answeredCorrectly: null,
              };

              if (
                parentLocation.locationType === LocationType.AREA &&
                !booleanPointInPolygon(
                  pointState.point,
                  parentLocation.polygons,
                )
              ) {
                return null;
              }

              return pointState;
            },
          ),
        )
      ).filter((result): result is PointState => result !== null);

      setInternalSearchResults(searchResults);
      setInternalSearchStatus(SearchStatus.SEARCHED);
    },
    [parentId, parentLocation],
  );

  const setSearchTerm = useCallback(
    (searchTerm: string) => {
      const debouncedSearch = debounce(() => {
        setInternalSearchTerm(searchTerm);
        if (searchTerm !== "") {
          fetchSearchResults(searchTerm);
        }
      }, 300);
      debouncedSearch();
    },
    [fetchSearchResults],
  ); // Add any other dependencies if needed

  const reset = useCallback(() => {
    setInternalSearchTerm("");
    setInternalSearchStatus(SearchStatus.SEARCHED);
    setInternalSearchResults([]);
  }, []);

  // initialize Google libraries
  useEffect(() => {
    const mapsLibrary = window.google.maps;

    if (!mapsLibrary) {
      console.error("Did not find Google Maps library");
      return;
    }

    if (!autocompleteServiceRef.current) {
      const placesLibrary = mapsLibrary.places;

      if (!placesLibrary) {
        console.error("Did not find Google Places library");
        return;
      }

      autocompleteServiceRef.current = new placesLibrary.AutocompleteService();
    }

    if (!geocoderRef.current) {
      geocoderRef.current = new mapsLibrary.Geocoder();
    }
  }, []);

  return {
    term: internalSearchTerm,
    status: internalSearchStatus,
    results: internalSearchResults,
    setTerm: setSearchTerm,
    reset,
  };
}
