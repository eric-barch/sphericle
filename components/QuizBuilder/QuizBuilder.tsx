import { useEffect, useState } from "react";
import LocationAdder from "./LocationAdder";
import { LocationType } from "./LocationType";

export default function QuizBuilder() {
  const [placesLoaded, setPlacesLoaded] = useState(false);

  useEffect(() => {
    async function loadPlacesLibrary() {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        await google.maps.importLibrary("places");
        setPlacesLoaded(true);
      } else {
        setPlacesLoaded(true);
      }
    }

    loadPlacesLibrary();
  }, []);

  if (!placesLoaded) return <div>Loading...</div>;

  return (
    <>
      <LocationAdder
        parentLocationType={LocationType.Area}
        parentLocationName="Root"
      />
    </>
  );
}
