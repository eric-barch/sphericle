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
import { CompleteDialog } from "./complete-dialog";

interface QuizTakerProps {
  googleLibsLoaded: boolean;
}

const QuizTaker = ({ googleLibsLoaded }: QuizTakerProps) => {
  const { allFeatures } = useAllFeatures();
  const {
    quizTaker: { remainingFeatureIds },
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
  const isComplete = remainingFeatureIds.size === 0;

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
          <CompleteDialog handleReset={handleReset} />
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
            disabled={isComplete}
          />
        </div>
      )}
    </>
  );
};

export { QuizTaker };
