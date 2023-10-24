import { useEffect, useState } from "react";
import LocationAdder from "./LocationAdder";
import { LocationType } from "../../types/types";

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
    <div className="m-3">
      <LocationAdder
        parentLocationType={LocationType.Area}
        parentLocationName="Root"
      />
    </div>
  );
}
