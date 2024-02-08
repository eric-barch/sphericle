import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

const usePlacesService = () => {
  const map = useMap();
  const placesLibrary = useMapsLibrary("places");

  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService>(null);

  useEffect(() => {
    if (!placesLibrary) {
      return;
    }

    setPlacesService(new placesLibrary.PlacesService(map));
  }, [placesLibrary, map]);

  return { placesService };
};

export { usePlacesService };
