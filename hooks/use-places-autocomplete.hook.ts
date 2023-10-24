import { GooglePlacesSuggestion } from "@/types/types";
import { useCallback, useEffect, useRef, useState } from "react";

interface Predictions {
  searchTerm: string;
  predictions: GooglePlacesSuggestion[] | null;
}

interface UsePlacesAutocompleteReturn {
  searchTerm: string;
  predictions: Predictions;
  setSearchTerm: (searchTerm: string) => void;
  clearAutocompletePredictions: () => void;
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

export default function usePlacesAutocomplete(): UsePlacesAutocompleteReturn {
  const [internalSearchTerm, setInternalSearchTermRaw] = useState<string>("");
  const [predictions, setPredictions] = useState<Predictions>({
    searchTerm: "",
    predictions: null,
  });

  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService>();
  const geocoderServiceRef = useRef<google.maps.Geocoder>();

  const init = useCallback(() => {
    const mapsLibrary = window.google.maps;

    if (!mapsLibrary) {
      console.error("Did not find Google Maps library");
      return;
    }

    if (!autocompleteServiceRef.current) {
      const placesLibrary = mapsLibrary.places;

      if (!placesLibrary) {
        console.error("Did not ind Google Places library");
        return;
      }

      autocompleteServiceRef.current = new placesLibrary.AutocompleteService();
    }

    if (!geocoderServiceRef.current) {
      geocoderServiceRef.current = new mapsLibrary.Geocoder();
    }
  }, []);

  const fetchPredictions = useCallback(
    debounce((searchTerm: string) => {
      autocompleteServiceRef.current?.getPlacePredictions(
        { input: searchTerm },
        async (
          response: google.maps.places.AutocompletePrediction[] | null,
        ) => {
          let predictions: GooglePlacesSuggestion[] = [];

          if (response) {
            predictions = await Promise.all(
              response.map(
                (responseItem) =>
                  new Promise<GooglePlacesSuggestion>((resolve, reject) => {
                    geocoderServiceRef.current?.geocode(
                      { placeId: responseItem.place_id },
                      (results, status) => {
                        if (status === google.maps.GeocoderStatus.OK) {
                          if (results![0]) {
                            const position = {
                              lat: results![0].geometry.location.lat(),
                              lng: results![0].geometry.location.lng(),
                            };
                            resolve({ ...responseItem, position });
                          }
                        }
                        reject(new Error("Geocoding failed"));
                      },
                    );
                  }),
              ),
            );
          }

          setPredictions({
            searchTerm,
            predictions,
          });
        },
      );
    }, 500),
    [],
  );

  const setSearchTerm = useCallback(
    (searchTerm: string) => {
      setInternalSearchTermRaw(searchTerm);
      fetchPredictions(searchTerm);
    },
    [fetchPredictions],
  );

  const clearAutocompletePredictions = useCallback(() => {
    setPredictions({
      searchTerm: "",
      predictions: null,
    });
  }, []);

  // runs init() on hook mount
  useEffect(() => {
    init();
  }, [init]);

  return {
    searchTerm: internalSearchTerm,
    predictions,
    setSearchTerm,
    clearAutocompletePredictions,
  };
}
