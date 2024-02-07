"use client";

import { Map } from "@/components/map";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isSubfeatureState } from "@/helpers";
import { useAllFeatures, useQuizTaker } from "@/providers";
import { DisplayMode, QuizTakerDispatchType } from "@/types";
import * as Dialog from "@radix-ui/react-dialog";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnswerBox } from "./answer-box";
import { ScoreBox } from "./score-box";

interface QuizTakerProps {
  googleLibsLoaded: boolean;
}

const QuizTaker = ({ googleLibsLoaded }: QuizTakerProps) => {
  const { allFeatures } = useAllFeatures();
  const {
    quizTaker: { remainingFeatureIds, correctFeatureIds, incorrectFeatureIds },
    quizTakerDispatch: quizTakerStateDispatch,
  } = useQuizTaker();

  const displayedFeature = (() => {
    const displayedFeature = allFeatures.get(
      remainingFeatureIds.values().next().value,
    );

    if (isSubfeatureState(displayedFeature)) {
      return displayedFeature;
    }
  })();

  const answerBoxInputRef = useRef<HTMLInputElement>();

  const [mapIsLoaded, setMapIsLoaded] = useState<boolean>(false);

  const handleReset = useCallback(() => {
    quizTakerStateDispatch({
      dispatchType: QuizTakerDispatchType.RESET,
    });

    setTimeout(() => {
      answerBoxInputRef.current?.focus();
    }, 0);
  }, [quizTakerStateDispatch]);

  const handleMapLoad = () => {
    /**TODO: This check shouldn't really be necessary. Need to revise Map so
     * it only fires this once. */
    if (mapIsLoaded) {
      return;
    }

    setMapIsLoaded(true);
  };

  const handleOpenAutoFocus = (event: Event) => {
    event.preventDefault();
  };

  /**Reset quiz on mount. */
  useEffect(() => {
    handleReset();
  }, [handleReset]);

  return (
    <>
      {(!googleLibsLoaded || !mapIsLoaded) && (
        <LoadingSpinner className="absolute left-0 right-0 top-0 z-40 bg-gray-700" />
      )}
      {googleLibsLoaded && (
        <div className="h-[calc(100vh-4rem)] relative flex justify-center align-middle content-center">
          <Dialog.Root open={remainingFeatureIds.size <= 0} modal={false}>
            <Dialog.Content
              className="fixed flex flex-col items-center p-4 bg-white text-black rounded-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40"
              onOpenAutoFocus={handleOpenAutoFocus}
            >
              <Dialog.Title>Quiz Complete!</Dialog.Title>
              <Dialog.Description className="m-4">{`Your score: ${
                correctFeatureIds.size
              } / ${
                correctFeatureIds.size + incorrectFeatureIds.size
              }`}</Dialog.Description>
              <Dialog.Close
                className="p-2 rounded-3xl bg-gray-500 text-white"
                onClick={handleReset}
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
            disabled={remainingFeatureIds.size <= 0}
          />
        </div>
      )}
    </>
  );
};

export { QuizTaker };
