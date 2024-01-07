"use client";

import Map from "@/components/Map";
import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import {
  AreaState,
  FeatureType,
  PointState,
  AllFeaturesDispatchType,
} from "@/types";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
import AnswerBox from "./AnswerBox";
import ScoreBox from "./ScoreBox";
import {
  useQuizBuilder,
  useQuizBuilderDispatch,
} from "../QuizBuilder/QuizBuilderProvider";

export default function QuizTaker() {
  const quiz = useQuiz();
  const quizDispatch = useQuizDispatch();

  const quizBuilder = useQuizBuilder();
  const quizBuilderDispatch = useQuizBuilderDispatch();

  const [quizComplete, setQuizComplete] = useState<boolean>(false);
  const [mapId, setMapId] = useState<string>("8777b9e5230900fc");
  const [bounds, setBounds] = useState<google.maps.LatLngBoundsLiteral>(null);
  const [emptyAreas, setEmptyAreas] = useState<AreaState | null>(null);
  const [filledAreas, setFilledAreas] = useState<AreaState | null>(null);
  const [markedPoints, setMarkedPoints] = useState<PointState | null>(null);

  const answerBoxInputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (!quizComplete) {
      quizDispatch({
        type: AllFeaturesDispatchType.RESET_TAKER,
      });
    }

    answerBoxInputRef?.current.focus();
  }, [quizComplete, quizDispatch]);

  useEffect(() => {
    const location = quiz[quizBuilder.selectedId];

    if (quiz.remaining.length <= 0) {
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
      location.featureType !== FeatureType.AREA &&
      location.featureType !== FeatureType.POINT
    ) {
      throw new Error("location must be of type AREA or POINT.");
    }

    const parentLocation = quiz[location.parentId];

    if (parentLocation.featureType === FeatureType.ROOT) {
      if (location.featureType === FeatureType.AREA) {
        setBounds(location.displayBounds);
        setEmptyAreas(null);
        setFilledAreas(location);
        setMarkedPoints(null);
      } else if (location.featureType === FeatureType.POINT) {
        setBounds(location.displayBounds);
        setEmptyAreas(null);
        setFilledAreas(null);
        setMarkedPoints(location);
      }
    } else if (parentLocation.featureType === FeatureType.AREA) {
      if (location.featureType === FeatureType.AREA) {
        setBounds(parentLocation.displayBounds);
        setEmptyAreas(parentLocation);
        setFilledAreas(location);
        setMarkedPoints(null);
      } else if (location.featureType === FeatureType.POINT) {
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
      type: AllFeaturesDispatchType.RESET_TAKER,
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
          <Dialog.Description className="m-4">{`Your score: ${quiz.correct} / ${quiz.size}`}</Dialog.Description>
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
