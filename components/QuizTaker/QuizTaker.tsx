import Map from "@/components/Map";
import { useQuiz } from "@/components/QuizProvider";
import { AreaState, PointState } from "@/types";
import { KeyboardEvent, useEffect, useState } from "react";
import AnswerBox from "./AnswerBox";
import { getQuizTakerLocationMapItems } from "./QuizTaker.helpers";

export default function QuizTaker() {
  const quiz = useQuiz();

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
    })();
  }, []);

  const takerSelected = quiz.takerSelected;

  useEffect(() => {
    if (takerSelected) {
      const {
        bounds = null,
        emptyAreas,
        filledAreas,
        points,
      } = getQuizTakerLocationMapItems(takerSelected);

      if (bounds) {
        setBounds(bounds);
      }

      setEmptyAreas(emptyAreas);
      setFilledAreas(filledAreas);
      setPoints(points);
    }
  }, [takerSelected]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter") {
      // quizDispatch({
      //   type: QuizDispatchType.IncrementedTakerLocation,
      // });
    }
  }

  return (
    <>
      {placesLoaded ? (
        <div
          className="h-[calc(100vh-48px)] relative flex justify-center content-center"
          onKeyDown={handleKeyDown}
        >
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
