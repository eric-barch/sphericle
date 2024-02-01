"use client";

import { useAllFeatures } from "@/components/all-features-provider";
import LoadingSpinner from "@/components/loading-spinner";
import Map from "@/components/map";
import { isSubfeatureState } from "@/helpers/feature-type-guards";
import {
  DisplayMode,
  QuizTakerStateDispatchType,
  SubfeatureState,
} from "@/types";
import * as Dialog from "@radix-ui/react-dialog";
import { useCallback, useEffect, useRef, useState } from "react";
import AnswerBox from "./answer-box";
import { useQuizTakerState } from "./quiz-taker-state-provider";
import ScoreBox from "./score-box";

interface QuizTakerProps {
  googleLibsLoaded: boolean;
}

export default function QuizTaker({ googleLibsLoaded }: QuizTakerProps) {
  const { rootId, allFeatures } = useAllFeatures();
  const { quizTakerState, quizTakerStateDispatch } = useQuizTakerState();

  const [mapIsLoaded, setMapIsLoaded] = useState<boolean>(false);
  const [displayedFeature, setDisplayedFeature] =
    useState<SubfeatureState | null>(null);

  const answerBoxInputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    quizTakerStateDispatch({
      dispatchType: QuizTakerStateDispatchType.RESET,
      rootId,
      allFeatures,
    });
  }, [rootId, allFeatures, quizTakerStateDispatch]);

  useEffect(() => {
    const newDisplayedFeature = allFeatures.get(
      quizTakerState.remainingFeatureIds.values().next().value,
    );

    if (!newDisplayedFeature || !isSubfeatureState(newDisplayedFeature)) {
      return;
    }

    if (newDisplayedFeature.featureId === displayedFeature?.featureId) {
      return;
    }

    setDisplayedFeature(newDisplayedFeature);
  }, [allFeatures, displayedFeature, quizTakerState]);

  const handleMapLoad = useCallback(() => {
    setMapIsLoaded(true);

    if (answerBoxInputRef.current) {
      answerBoxInputRef.current.focus();
    }
  }, []);

  const handleOpenAutoFocus = useCallback((event: Event) => {
    event.preventDefault();
  }, []);

  const handleClick = useCallback(() => {
    quizTakerStateDispatch({
      dispatchType: QuizTakerStateDispatchType.RESET,
      rootId,
      allFeatures,
    });

    setTimeout(() => {
      if (answerBoxInputRef.current) {
        answerBoxInputRef.current.focus();
      }
    }, 0);
  }, [rootId, allFeatures, quizTakerStateDispatch]);

  return (
    <>
      {!googleLibsLoaded || !mapIsLoaded ? (
        <LoadingSpinner className="absolute left-0 right-0 top-0 z-40 bg-gray-700" />
      ) : null}
      {googleLibsLoaded ? (
        <div className="h-[calc(100vh-4rem)] relative flex justify-center align-middle content-center">
          <Dialog.Root
            open={quizTakerState.remainingFeatureIds.size <= 0}
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
            onLoad={handleMapLoad}
            padding={{
              top: 50,
              bottom: 110,
              left: 50,
              right: 50,
            }}
            mapId="8777b9e5230900fc"
            displayedFeature={displayedFeature}
            displayMode={DisplayMode.QUIZ_TAKER}
          />
          <AnswerBox
            displayedFeature={displayedFeature}
            inputRef={answerBoxInputRef}
            disabled={quizTakerState.remainingFeatureIds.size <= 0}
          />
        </div>
      ) : null}
    </>
  );
}
