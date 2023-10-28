import { LocationType } from "@/types";
import { useEffect, useState } from "react";
import LocationAdder from "./LocationAdder";

export default function QuizBuilder() {
  const [placesLoaded, setPlacesLoaded] = useState(false);

  // TODO: is this a janky way of loading the places library?
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

  return (
    <div className="m-3">
      {placesLoaded ? (
        <LocationAdder
          parentLocationType={LocationType.Area}
          parentLocationName="Root"
        />
      ) : (
        "Loading..."
      )}
    </div>
  );
}
