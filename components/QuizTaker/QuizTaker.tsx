"use client";

import { useAllFeatures } from "@/components/AllFeaturesProvider";
import Map from "@/components/Map";
import {
  AreaState,
  DisplayMode,
  FeatureType,
  PointState,
  QuizTakerStateDispatchType,
} from "@/types";
import * as Dialog from "@radix-ui/react-dialog";
import { useCallback, useEffect, useRef, useState } from "react";
import AnswerBox from "./AnswerBox";
import { useQuizTakerState } from "./QuizTakerStateProvider";
import ScoreBox from "./ScoreBox";
import LoadingSpinner from "../LoadingSpinner";

interface QuizTakerProps {
  googleLibsLoaded: boolean;
}

export default function QuizTaker({ googleLibsLoaded }: QuizTakerProps) {
  const { rootId, allFeatures } = useAllFeatures();
  const { quizTakerState, quizTakerStateDispatch } = useQuizTakerState();

  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [displayedFeature, setDisplayedFeature] = useState<
    AreaState | PointState | null
  >(null);

  const answerBoxInputRef = useRef<HTMLInputElement>();

  // reset quiz on component mount
  useEffect(() => {
    quizTakerStateDispatch({
      type: QuizTakerStateDispatchType.RESET,
      rootId,
      allFeatures,
    });
  }, [rootId, allFeatures, quizTakerStateDispatch]);

  // set displayed location when orderedIdsIndex changes
  useEffect(() => {
    const displayedFeature = allFeatures.get(
      quizTakerState.remainingFeatureIds.values().next().value,
    );

    if (
      !displayedFeature ||
      (displayedFeature.featureType !== FeatureType.AREA &&
        displayedFeature.featureType !== FeatureType.POINT)
    ) {
      return;
    }

    setDisplayedFeature(displayedFeature);
  }, [allFeatures, quizTakerState]);

  const handleMapLoad = useCallback(() => {
    setMapLoaded(true);

    if (answerBoxInputRef.current) {
      answerBoxInputRef.current.focus();
    }
  }, []);

  const handleOpenAutoFocus = useCallback((event: Event) => {
    event.preventDefault();
  }, []);

  const handleClick = useCallback(() => {
    quizTakerStateDispatch({
      type: QuizTakerStateDispatchType.RESET,
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
      {!googleLibsLoaded || !mapLoaded ? (
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
