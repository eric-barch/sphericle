import { LocationType, Point, PointSearchResults } from "@/types";
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
  searchResults: PointSearchResults;
  setSearchTerm: (searchTerm: string) => void;
  clearSearchResults: () => void;
}

function debounce<Fn extends (...args: any[]) => void>(
  fn: Fn,
  delay: number,
): (this: ThisParameterType<Fn>, ...args: Parameters<Fn>) => void {
  let timer: ReturnType<typeof setTimeout> | null;

  return function (this: ThisParameterType<Fn>, ...args: Parameters<Fn>) {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

export default function usePointSearch(): UsePointSearchReturn {
  const [internalSearchTerm, setInternalSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<PointSearchResults>({
    searchTerm: "",
    searchResults: [],
  });

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

  const fetchSearchResults = useCallback(
    debounce((searchTerm: string) => {
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

            setSearchResults({ searchTerm, searchResults });
          }
        },
      );
    }, 500),
    [],
  );

  const setSearchTerm = useCallback(
    (searchTerm: string) => {
      setInternalSearchTerm(searchTerm);
      fetchSearchResults(searchTerm);
    },
    [fetchSearchResults],
  );

  const clearSearchResults = useCallback(() => {
    setSearchResults((prevState) => ({ ...prevState, searchResults: [] }));
  }, []);

  useEffect(() => {
    init();
    // TODO: ask if i need to return any cleanup stuff here
  }, [init]);

  return {
    searchTerm: internalSearchTerm,
    searchResults,
    setSearchTerm,
    clearSearchResults,
  };
}
