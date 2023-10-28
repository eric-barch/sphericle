import { LocationType, Point, SearchStatus } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

type Suggestion = google.maps.places.AutocompletePrediction;

interface GeocodedSuggestion extends Suggestion {
  position: {
    lat: number;
    lng: number;
  };
}

interface UsePointSearchReturn {
  searchTerm: string;
  searchStatus: SearchStatus;
  searchResults: Point[] | null;
  setSearchTerm: (searchTerm: string) => void;
  reset: () => void;
}

export default function usePointSearch(): UsePointSearchReturn {
  const [internalSearchTerm, setInternalSearchTerm] = useState<string>("");
  const [internalSearchStatus, setInternalSearchStatus] =
    useState<SearchStatus>(SearchStatus.Searched);
  const [internalSearchResults, setInternalSearchResults] = useState<
    Point[] | null
  >(null);

  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService>();
  const geocoderRef = useRef<google.maps.Geocoder>();

  const init = useCallback(() => {
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

  const fetchSearchResults = useCallback((searchTerm: string) => {
    setInternalSearchTerm(searchTerm);
    setInternalSearchStatus(SearchStatus.Searching);

    autocompleteServiceRef.current?.getPlacePredictions(
      { input: searchTerm },
      async (suggestions: Suggestion[] | null) => {
        let geocodedSuggestions: GeocodedSuggestion[] = [];

        if (suggestions) {
          geocodedSuggestions = await Promise.all(
            suggestions.map(
              (suggestion) =>
                new Promise<GeocodedSuggestion>((resolve, reject) => {
                  geocoderRef.current?.geocode(
                    { placeId: suggestion.place_id },
                    (results, status) => {
                      if (status === google.maps.GeocoderStatus.OK) {
                        if (results![0]) {
                          const position = {
                            lat: results![0].geometry.location.lat(),
                            lng: results![0].geometry.location.lng(),
                          };
                          resolve({ ...suggestion, position });
                        }
                      }
                      reject(new Error("Geocoding failed"));
                    },
                  );
                }),
            ),
          );

          let searchResults: Point[] = [];

          if (geocodedSuggestions) {
            searchResults = geocodedSuggestions.map((geocodedSuggestion) => ({
              locationType: LocationType.Point,
              placeId: geocodedSuggestion.place_id,
              fullName: geocodedSuggestion.description,
              displayName: geocodedSuggestion.description,
              position: geocodedSuggestion.position,
            }));
          }

          setInternalSearchResults(searchResults);
          setInternalSearchStatus(SearchStatus.Searched);
        }
      },
    );
  }, []);

  const setSearchTerm = useCallback(
    (searchTerm: string) => {
      if (searchTerm === internalSearchTerm) return;
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

  useEffect(() => {
    init();
    // TODO: ask if i need to return any cleanup stuff here
  }, [init]);

  return {
    searchTerm: internalSearchTerm,
    searchStatus: internalSearchStatus,
    searchResults: internalSearchResults,
    setSearchTerm,
    reset,
  };
}
