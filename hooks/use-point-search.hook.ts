import {
  AreaState,
  LocationType,
  PointState,
  SearchStatus,
  Quiz,
} from "@/types";
import debounce from "@/utils/debounce";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { Point } from "geojson";
import { useCallback, useEffect, useRef, useState } from "react";

interface UsePointSearchReturn {
  searchTerm: string;
  searchStatus: SearchStatus;
  searchResults: PointState[];
  setSearchTerm: (searchTerm: string) => void;
  reset: () => void;
}

export default function usePointSearch(
  parentLocation: Quiz | AreaState,
): UsePointSearchReturn {
  const [internalSearchTerm, setInternalSearchTerm] = useState<string>("");
  const [internalSearchStatus, setInternalSearchStatus] =
    useState<SearchStatus>(SearchStatus.Searched);
  const [internalSearchResults, setInternalSearchResults] = useState<
    PointState[]
  >([]);

  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService>();
  const geocoderRef = useRef<google.maps.Geocoder>();

  const fetchSearchResults = useCallback(async (searchTerm: string) => {
    setInternalSearchTerm(searchTerm);
    setInternalSearchStatus(SearchStatus.Searching);

    if (!autocompleteServiceRef.current) {
      throw new Error("Did not find autocompleteServiceRef.");
    }

    let request: {
      input: string;
      locationRestriction?: google.maps.LatLngBoundsLiteral;
    } = {
      input: searchTerm,
    };

    if (parentLocation.locationType === LocationType.Area) {
      request.locationRestriction = parentLocation.displayBounds;
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

            const pointState = {
              id: crypto.randomUUID(),
              googlePlaceId: autocompletePrediction.place_id,
              parentLocation,
              locationType: LocationType.Point as LocationType.Point,
              longName: autocompletePrediction.description,
              shortName: autocompletePrediction.description,
              userDefinedName: "",
              point,
            };

            if (
              parentLocation.locationType === LocationType.Area &&
              !booleanPointInPolygon(pointState.point, parentLocation.polygon)
            ) {
              return null;
            }

            return pointState;
          },
        ),
      )
    ).filter((result): result is PointState => result !== null);

    setInternalSearchResults(searchResults);
    setInternalSearchStatus(SearchStatus.Searched);
  }, []);

  const setSearchTerm = useCallback(
    debounce((searchTerm: string) => {
      setInternalSearchTerm(searchTerm);
      if (searchTerm !== "") {
        fetchSearchResults(searchTerm);
      }
    }, 300), // 300ms delay
    [fetchSearchResults],
  );

  const reset = useCallback(() => {
    setInternalSearchTerm("");
    setInternalSearchStatus(SearchStatus.Searched);
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
    searchTerm: internalSearchTerm,
    searchStatus: internalSearchStatus,
    searchResults: internalSearchResults,
    setSearchTerm,
    reset,
  };
}
