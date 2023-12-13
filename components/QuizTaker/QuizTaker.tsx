"use client";

import Map from "@/components/Map";
import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import { AreaState, LocationType, PointState, QuizDispatchType } from "@/types";
import { useEffect, useRef, useState } from "react";
import AnswerBox from "./AnswerBox";
import ScoreBox from "./ScoreBox";

export default function QuizTaker() {
  const quiz = useQuiz();
  const quizDispatch = useQuizDispatch();

  const [mapId, setMapId] = useState<string>("8777b9e5230900fc");
  const [bounds, setBounds] = useState<google.maps.LatLngBoundsLiteral>(null);
  const [emptyAreas, setEmptyAreas] = useState<AreaState | null>(null);
  const [filledAreas, setFilledAreas] = useState<AreaState | null>(null);
  const [markedPoints, setMarkedPoints] = useState<PointState | null>(null);

  const answerBoxInputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    quizDispatch({
      type: QuizDispatchType.RESET_TAKER,
    });

    if (answerBoxInputRef?.current) {
      answerBoxInputRef.current.focus();
    }
  }, [quizDispatch, quiz.rootId]);

  useEffect(() => {
    const location = quiz.locations[quiz.takerSelectedId];

    if (!location) {
      setEmptyAreas(null);
      setFilledAreas(null);
      setMarkedPoints(null);
      return;
    }

    if (
      location.locationType !== LocationType.AREA &&
      location.locationType !== LocationType.POINT
    ) {
      throw new Error("location must be of type AREA or POINT.");
    }

    const parentLocation = quiz.locations[location.parentId];

    if (parentLocation.locationType === LocationType.ROOT) {
      if (location.locationType === LocationType.AREA) {
        setBounds(location.displayBounds);
        setEmptyAreas(null);
        setFilledAreas(location);
        setMarkedPoints(null);
      } else if (location.locationType === LocationType.POINT) {
        setBounds(location.displayBounds);
        setEmptyAreas(null);
        setFilledAreas(null);
        setMarkedPoints(location);
      }
    } else if (parentLocation.locationType === LocationType.AREA) {
      if (location.locationType === LocationType.AREA) {
        setBounds(parentLocation.displayBounds);
        setEmptyAreas(parentLocation);
        setFilledAreas(location);
        setMarkedPoints(null);
      } else if (location.locationType === LocationType.POINT) {
        setBounds(parentLocation.displayBounds);
        setEmptyAreas(parentLocation);
        setFilledAreas(null);
        setMarkedPoints(location);
      }
    }
  }, [quiz]);

  return (
    <div className="h-[calc(100vh-3rem)] relative flex justify-center content-center">
      <ScoreBox />
      <Map
        mapId={mapId}
        bounds={bounds}
        padding={{ top: 50, right: 50, bottom: 100, left: 50 }}
        emptyAreas={emptyAreas}
        filledAreas={filledAreas}
        markedPoints={markedPoints}
      />
      <AnswerBox inputRef={answerBoxInputRef} />
    </div>
  );
}
