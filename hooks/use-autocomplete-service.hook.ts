import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

const useAutocompleteService = () => {
  const map = useMap();
  const placesLibrary = useMapsLibrary("places");

  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService>(null);

  useEffect(() => {
    if (!placesLibrary) {
      return;
    }

    setAutocompleteService(new placesLibrary.AutocompleteService());
  }, [placesLibrary, map]);

  return { autocompleteService };
};

export { useAutocompleteService };
