import Map from "@/components/Map";
import { useQuiz } from "@/components/QuizContext";
import { AreaState, LocationType, PointState } from "@/types";
import { useEffect, useState } from "react";
import AnswerBox from "./AnswerBox";

interface QuizTakerProps {}

export default function QuizTaker({}: QuizTakerProps) {
  const [placesLoaded, setPlacesLoaded] = useState<boolean>(false);
  const [bounds, setBounds] = useState<google.maps.LatLngBoundsLiteral | null>({
    north: 40.9176,
    south: 40.4774,
    east: -73.7004,
    west: -74.2591,
  });
  const [emptyAreas, setEmptyAreas] = useState<AreaState[]>([]);
  const [filledAreas, setFilledAreas] = useState<AreaState[]>([]);
  const [markers, setMarkers] = useState<PointState[]>([]);
  const quiz = useQuiz();

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
    <>
      {placesLoaded ? (
        <div className="h-[calc(100vh-48px)] relative flex justify-center content-center">
          <Map
            mapId="8777b9e5230900fc"
            bounds={bounds}
            emptyAreas={emptyAreas}
            filledAreas={filledAreas}
            markers={markers}
          />
          <AnswerBox />
        </div>
      ) : (
        "Loading..."
      )}
    </>
  );
}
