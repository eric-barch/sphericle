import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

const useGeocodingService = () => {
  const map = useMap();
  const geocodingLibrary = useMapsLibrary("geocoding");

  const [geocodingService, setGeocodingService] =
    useState<google.maps.Geocoder>(null);

  useEffect(() => {
    if (!geocodingLibrary) {
      return;
    }

    setGeocodingService(new geocodingLibrary.Geocoder());
  }, [geocodingLibrary, map]);

  return { geocodingService };
};

export { useGeocodingService };
