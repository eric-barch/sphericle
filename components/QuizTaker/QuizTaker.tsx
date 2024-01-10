"use client";

import { useAllFeatures } from "@/components/AllFeaturesProvider";
import Map from "@/components/Map";
import {
  AreaState,
  DisplayMode,
  PointState,
  QuizTakerDispatchType,
} from "@/types";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
import AnswerBox from "./AnswerBox";
import { useQuizTakerDispatch, useQuizTakerState } from "./QuizTakerProvider";
import ScoreBox from "./ScoreBox";

export default function QuizTaker() {
  const allFeatures = useAllFeatures();

  const quizTakerState = useQuizTakerState();
  const quizTakerDispatch = useQuizTakerDispatch();

  const [displayedFeature, setDisplayedFeature] = useState<
    AreaState | PointState | null
  >(
    allFeatures.features[
      quizTakerState.remainingIds[quizTakerState.currentIndex]
    ] as AreaState | PointState,
  );

  const answerBoxInputRef = useRef<HTMLInputElement>();

  // reset quiz on component mount
  useEffect(() => {
    quizTakerDispatch({
      type: QuizTakerDispatchType.RESET,
      allFeatures,
    });
  }, [allFeatures, quizTakerDispatch]);

  // set displayed location when orderedIdsIndex changes
  useEffect(() => {
    const displayedFeature = allFeatures.features[
      quizTakerState.remainingIds[quizTakerState.currentIndex]
    ] as AreaState | PointState;

    console.log("displayedFeature", displayedFeature);

    setDisplayedFeature(displayedFeature);
  }, [allFeatures, quizTakerState]);

  function handleOpenAutoFocus(event: Event) {
    event.preventDefault();
  }

  function handleClick() {
    quizTakerDispatch({
      type: QuizTakerDispatchType.RESET,
      allFeatures,
    });
  }

  return (
    <div className="h-[calc(100vh-3rem)] relative flex justify-center align-middle content-center">
      <Dialog.Root
        open={
          quizTakerState.currentIndex === quizTakerState.remainingIds.length
        }
        modal={false}
      >
        <Dialog.Content
          className="fixed flex flex-col items-center p-4 bg-white text-black rounded-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40"
          onOpenAutoFocus={handleOpenAutoFocus}
        >
          <Dialog.Title>Quiz Complete!</Dialog.Title>
          <Dialog.Description className="m-4">{`Your score: ${quizTakerState
            ?.correctFeatureIds.size} / ${
            quizTakerState.correctFeatureIds.size +
            quizTakerState.incorrectFeatureIds.size
          }`}</Dialog.Description>
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
        mapId="8777b9e5230900fc"
        displayedFeature={displayedFeature}
        displayMode={DisplayMode.QUIZ_TAKER}
      />
      <AnswerBox
        displayedFeature={displayedFeature}
        inputRef={answerBoxInputRef}
        disabled={
          quizTakerState.currentIndex === quizTakerState.remainingIds.length
        }
      />
    </div>
  );
}
