import {
  AreaState,
  LocationType,
  PointState,
  SearchStatus,
  TreeState,
} from "@/types";
import booleanContains from "@turf/boolean-contains";
import { Point } from "geojson";
import { useCallback, useEffect, useRef, useState } from "react";

interface UsePointSearchReturn {
  searchTerm: string;
  searchStatus: SearchStatus;
  searchResults: PointState[] | null;
  setSearchTerm: (searchTerm: string) => void;
  reset: () => void;
}

export default function usePointSearch(
  parent: TreeState | AreaState,
): UsePointSearchReturn {
  const [internalSearchTerm, setInternalSearchTerm] = useState<string>("");
  const [internalSearchStatus, setInternalSearchStatus] =
    useState<SearchStatus>(SearchStatus.Searched);
  const [internalSearchResults, setInternalSearchResults] = useState<
    PointState[] | null
  >(null);

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

    if (parent.locationType === LocationType.Area) {
      request.locationRestriction = parent.bounds;
    }

    const autocompletePredictions = (
      await autocompleteServiceRef.current.getPlacePredictions(request)
    ).predictions;

    const searchResults = (
      await Promise.all(
        autocompletePredictions.map(
          async (autocompletePrediction): Promise<PointState | null> => {
            if (!geocoderRef.current) {
              throw new Error("Did not find geocoderServiceRef.");
            }

            const geocoderResult = (
              await geocoderRef.current.geocode({
                placeId: autocompletePrediction.place_id,
              })
            ).results[0];

            const location = geocoderResult.geometry.location;

            const lat = location.lat();
            const lng = location.lng();

            const point: Point = { type: "Point", coordinates: [lng, lat] };

            const geocodedAutocompletePrediction = {
              ...autocompletePrediction,
              point,
            };

            const pointState = {
              parent: parent,
              locationType: LocationType.Point as LocationType.Point,
              placeId: geocodedAutocompletePrediction.place_id,
              fullName: geocodedAutocompletePrediction.description,
              displayName: geocodedAutocompletePrediction.description,
              point: geocodedAutocompletePrediction.point,
            };

            if (
              parent.locationType === LocationType.Tree ||
              booleanContains(parent.polygon, pointState.point)
            ) {
              return pointState;
            }

            return null;
          },
        ),
      )
    ).filter((result): result is PointState => result !== null);

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
