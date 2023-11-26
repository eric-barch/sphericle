import Map from "@/components/Map";
import SplitPane from "@/components/SplitPane";
import { AreaState, LocationType, PointState, Quiz } from "@/types";
import { useEffect, useState } from "react";
import { Sublocations } from "./Sublocations";

export default function QuizBuilder() {
  const [placesLoaded, setPlacesLoaded] = useState<boolean>(false);
  const [bounds, setBounds] = useState<google.maps.LatLngBoundsLiteral | null>(
    null,
  );
  const [emptyAreas, setEmptyAreas] = useState<AreaState[]>([]);
  const [filledAreas, setFilledAreas] = useState<AreaState[]>([]);
  const [markers, setMarkers] = useState<PointState[]>([]);
  const [quiz, setQuiz] = useState<Quiz | AreaState>({
    locationType: LocationType.Quiz,
    sublocations: [],
  });

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

  function setDisplayedLocation(location: AreaState | PointState | null) {
    if (location) {
      if (location.locationType === LocationType.Area) {
        if (location.open) {
          setEmptyAreas([location]);
          setFilledAreas(null);
          setBounds(location.displayBounds);
        } else {
          if (location.parentLocation.locationType === LocationType.Quiz) {
            setEmptyAreas(null);
            setBounds(location.displayBounds);
          } else if (
            location.parentLocation.locationType === LocationType.Area
          ) {
            setEmptyAreas([location.parentLocation]);
            setBounds(location.parentLocation.displayBounds);
          }

          setFilledAreas([location]);
        }
        setMarkers(null);
      } else if (location.locationType === LocationType.Point) {
        if (location.parentLocation.locationType === LocationType.Quiz) {
          const lng = location.point.coordinates[0];
          const lat = location.point.coordinates[1];
          const diff = 0.1;

          const north = lat + diff;
          const east = lng + diff;
          const south = lat - diff;
          const west = lng - diff;

          setEmptyAreas(null);
          setBounds({ north, east, south, west });
        } else {
          setEmptyAreas([location.parentLocation]);
          setBounds(location.parentLocation.displayBounds);
        }

        setFilledAreas(null);
        setMarkers([location]);
      }
    } else {
      setEmptyAreas(null);
      setFilledAreas(null);
      setMarkers(null);
    }
  }

  useEffect(() => {
    console.log(quiz);
  }, [quiz]);

  return (
    <>
      {placesLoaded ? (
        <SplitPane>
          <Sublocations
            className={`p-3 overflow-auto custom-scrollbar max-h-[calc(100vh-48px)]`}
            parentState={quiz}
            setParentState={setQuiz}
            setDisplayedLocation={setDisplayedLocation}
            setParentOutlined={() => {}}
          />
          <Map
            mapId="696d0ea42431a75c"
            bounds={bounds}
            emptyAreas={emptyAreas}
            filledAreas={filledAreas}
            markers={markers}
          />
        </SplitPane>
      ) : (
        "Loading..."
      )}
    </>
  );
}
