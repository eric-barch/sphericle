"use client";

import Map from "@/components/Map";
import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import { AreaState, LocationType, PointState, QuizDispatchType } from "@/types";
import * as Dialog from "@radix-ui/react-dialog";
import { FocusEvent, useEffect, useRef, useState } from "react";
import AnswerBox from "./AnswerBox";
import ScoreBox from "./ScoreBox";

export default function QuizTaker() {
  const quiz = useQuiz();
  const quizDispatch = useQuizDispatch();

  const [quizComplete, setQuizComplete] = useState<boolean>(false);
  const [mapId, setMapId] = useState<string>("8777b9e5230900fc");
  const [bounds, setBounds] = useState<google.maps.LatLngBoundsLiteral>(null);
  const [emptyAreas, setEmptyAreas] = useState<AreaState | null>(null);
  const [filledAreas, setFilledAreas] = useState<AreaState | null>(null);
  const [markedPoints, setMarkedPoints] = useState<PointState | null>(null);

  const answerBoxInputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (!quiz.isComplete) {
      quizDispatch({
        type: QuizDispatchType.RESET_TAKER,
      });
    }

    answerBoxInputRef?.current.focus();
  }, [quiz.isComplete, quizDispatch]);

  useEffect(() => {
    const location = quiz.locations[quiz.takerSelectedId];

    if (
      quiz.correctLocations + quiz.incorrectLocations >=
      quiz.totalLocations
    ) {
      setQuizComplete(true);
    } else {
      setQuizComplete(false);
    }

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

  function handleOpenAutoFocus(event: Event) {
    event.preventDefault();
  }

  function handleClick() {
    quizDispatch({
      type: QuizDispatchType.RESET_TAKER,
    });
  }

  return (
    <div className="h-[calc(100vh-3rem)] relative flex justify-center align-middle content-center">
      <Dialog.Root open={quizComplete} modal={false}>
        <Dialog.Content
          className="fixed flex flex-col items-center p-4 bg-white text-black rounded-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40"
          onOpenAutoFocus={handleOpenAutoFocus}
        >
          <Dialog.Title>Quiz Complete!</Dialog.Title>
          <Dialog.Description className="m-4">{`Your score: ${quiz.correctLocations} / ${quiz.totalLocations}`}</Dialog.Description>
          <Dialog.Close
            className="p-2 rounded-3xl bg-gray-500 text-white"
            onClick={handleClick}
          >
            Take Again
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
      <ScoreBox />
      <Map
        mapId={mapId}
        bounds={bounds}
        padding={{ top: 50, right: 50, bottom: 100, left: 50 }}
        emptyAreas={emptyAreas}
        filledAreas={filledAreas}
        markedPoints={markedPoints}
      />
      <AnswerBox inputRef={answerBoxInputRef} disabled={quizComplete} />
    </div>
  );
}
