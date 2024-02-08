"use client";

import { QuizBuilder } from "@/components/quiz-builder";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

const BuildQuiz = () => {
  const map = useMap();

  const placesLib = useMapsLibrary("places");
  const [placesService, setPlacesService] = useState(null);

  const geocodingLib = useMapsLibrary("geocoding");
  const [geocodingService, setGeocodingService] = useState(null);

  useEffect(() => {
    if (!placesLib) return;

    setPlacesService(new placesLib.PlacesService(map));
  }, [map, placesLib]);

  useEffect(() => {
    if (!geocodingLib) return;

    setGeocodingService(new geocodingLib.Geocoder());
  }, [map, geocodingLib]);

  return (
    <QuizBuilder
      servicesReady={placesService !== null && geocodingService !== null}
    />
  );
};

export default BuildQuiz;
