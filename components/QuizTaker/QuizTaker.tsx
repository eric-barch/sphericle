import Map from "@/components/Map";
import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import { useEffect, useState } from "react";
import AnswerBox from "./AnswerBox";
import { AreaState, LocationType, PointState, QuizDispatchType } from "@/types";

interface QuizTakerProps {}

export default function QuizTaker({}: QuizTakerProps) {
  const quiz = useQuiz();
  const quizDispatch = useQuizDispatch();

  const [placesLoaded, setPlacesLoaded] = useState<boolean>(false);
  const [bounds, setBounds] = useState<google.maps.LatLngBoundsLiteral>(null);
  const [emptyAreas, setEmptyAreas] = useState<AreaState[] | AreaState | null>(
    null,
  );
  const [filledAreas, setFilledAreas] = useState<
    AreaState[] | AreaState | null
  >(null);
  const [points, setPoints] = useState<PointState[] | PointState | null>(null);

  useEffect(() => {
    (async function loadPlacesLibrary() {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        await google.maps.importLibrary("places");
        setPlacesLoaded(true);
      } else {
        setPlacesLoaded(true);
      }

      quizDispatch({
        type: QuizDispatchType.TakeSelected,
        location: quiz.sublocations[0],
      });
    })();
  }, []);

  const takeSelected = quiz.takeSelected;

  useEffect(() => {
    if (takeSelected) {
      if (takeSelected.parentLocation.locationType === LocationType.Quiz) {
        setEmptyAreas(null);
      } else {
        setBounds(takeSelected.parentLocation.displayBounds);
        setEmptyAreas(takeSelected.parentLocation);
      }

      if (takeSelected.locationType === LocationType.Area) {
        setFilledAreas(takeSelected);
        setPoints(null);
      } else if (takeSelected.locationType === LocationType.Point) {
        setPoints(takeSelected);
        setFilledAreas(null);
      }
    }
  }, [takeSelected]);

  return (
    <>
      {placesLoaded ? (
        <div className="h-[calc(100vh-48px)] relative flex justify-center content-center">
          <Map
            mapId="8777b9e5230900fc"
            bounds={bounds}
            emptyAreas={emptyAreas}
            filledAreas={filledAreas}
            points={points}
          />
          <AnswerBox />
        </div>
      ) : (
        "Loading..."
      )}
    </>
  );
}
