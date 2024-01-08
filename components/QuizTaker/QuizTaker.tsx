"use client";

import { useAllFeatures } from "@/components/AllFeaturesProvider";
import Map from "@/components/Map";
import {
  AreaState,
  DisplayMode,
  PointState,
  QuizTakerDispatchType,
  RootState,
} from "@/types";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
import AnswerBox from "./AnswerBox";
import QuizTakerProvider, {
  useQuizTaker,
  useQuizTakerDispatch,
} from "./QuizTakerProvider";
import ScoreBox from "./ScoreBox";

export default function QuizTaker() {
  const allFeatures = useAllFeatures();

  const quizTaker = useQuizTaker();
  const quizTakerDispatch = useQuizTakerDispatch();

  const [displayedLocation, setDisplayedLocation] = useState<
    RootState | AreaState | PointState | null
  >(null);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const answerBoxInputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    quizTakerDispatch({
      type: QuizTakerDispatchType.RESET,
      allFeatures,
    });
  }, [allFeatures, quizTakerDispatch]);

  useEffect(() => {
    setIsComplete(quizTaker.current === quizTaker.orderedIds.length);
  }, [quizTaker]);

  useEffect(() => {
    setDisplayedLocation(
      allFeatures.features[quizTaker.orderedIds[quizTaker.orderedIds.length]],
    );
  }, [allFeatures, quizTaker]);

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
      <Dialog.Root open={isComplete} modal={false}>
        <Dialog.Content
          className="fixed flex flex-col items-center p-4 bg-white text-black rounded-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40"
          onOpenAutoFocus={handleOpenAutoFocus}
        >
          <Dialog.Title>Quiz Complete!</Dialog.Title>
          <Dialog.Description className="m-4">{`Your score: ${quizTaker
            ?.correctIds.size} / ${
            quizTaker.correctIds.size + quizTaker.incorrectIds.size
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
        displayedLocation={displayedLocation}
        displayMode={DisplayMode.QUIZ_TAKER}
      />
      <AnswerBox inputRef={answerBoxInputRef} disabled={isComplete} />
    </div>
  );
}
