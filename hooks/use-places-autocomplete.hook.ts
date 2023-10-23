import { useCallback, useEffect, useRef, useState } from "react";

type AutocompletePrediction = google.maps.places.AutocompletePrediction;

interface AutocompletePredictions {
  searchTerm: string;
  autocompletePredictions: AutocompletePrediction[] | null;
}

interface UsePlacesAutocompleteArgs {}

interface UsePlacesAutocompleteReturn {
  searchTerm: string;
  autocompletePredictions: AutocompletePredictions;
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

export default function usePlacesAutocomplete({}: UsePlacesAutocompleteArgs): UsePlacesAutocompleteReturn {
  const [internalSearchTerm, setInternalSearchTermRaw] = useState<string>("");
  const [autocompletePredictions, setAutocompletePredictions] =
    useState<AutocompletePredictions>({
      searchTerm: "",
      autocompletePredictions: null,
    });

  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService>();

  const init = useCallback(() => {
    if (autocompleteServiceRef.current) return;

    const placesLibrary = window.google.maps.places;

    if (!placesLibrary) {
      console.error("Did not find Google Places library");
      return;
    }

    autocompleteServiceRef.current = new placesLibrary.AutocompleteService();
  }, []);

  const fetchAutocompletePredictions = useCallback(
    debounce((searchTerm: string) => {
      setAutocompletePredictions({ searchTerm, autocompletePredictions: null });

      autocompleteServiceRef.current?.getPlacePredictions(
        { input: searchTerm },
        (response: AutocompletePrediction[] | null) => {
          setAutocompletePredictions({
            searchTerm,
            autocompletePredictions: response || [],
          });
        },
      );
    }, 200),
    [],
  );

  const setSearchTerm = useCallback(
    (searchTerm: string) => {
      setInternalSearchTermRaw(searchTerm);
      fetchAutocompletePredictions(searchTerm);
    },
    [fetchAutocompletePredictions],
  );

  const clearAutocompletePredictions = useCallback(() => {
    setAutocompletePredictions({
      searchTerm: "",
      autocompletePredictions: null,
    });
  }, []);

  // runs init() on hook mount
  useEffect(() => {
    init();

    return () => {
      // cleanup
    };
  }, [init]);

  return {
    searchTerm: internalSearchTerm,
    autocompletePredictions,
    setSearchTerm,
    clearAutocompletePredictions,
  };
}
