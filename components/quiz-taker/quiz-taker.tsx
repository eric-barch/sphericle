"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isChild } from "@/helpers";
import { useAllFeatures, useQuizTaker } from "@/providers";
import { QuizTakerDispatchType } from "@/types";
import { Map } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnswerBox } from "./answer-box";
import { CompleteDialog } from "./complete-dialog";
import { ScoreBox } from "./score-box";

type QuizTakerProps = {
  googleLibsLoaded: boolean;
};

const QuizTaker = ({ googleLibsLoaded }: QuizTakerProps) => {
  const { allFeatures } = useAllFeatures();
  const {
    quizTaker: { remainingIds: remainingFeatureIds },
    quizTakerDispatch,
  } = useQuizTaker();

  const displayedFeature = (() => {
    const displayedFeature = allFeatures.get(
      remainingFeatureIds.values().next().value,
    );

    if (isChild(displayedFeature)) {
      return displayedFeature;
    }
  })();
  const isComplete = remainingFeatureIds.size === 0;

  const answerBoxInputRef = useRef<HTMLInputElement>();

  const [mapIsLoaded, setMapIsLoaded] = useState<boolean>(false);

  const handleReset = useCallback(() => {
    quizTakerDispatch({
      type: QuizTakerDispatchType.RESET,
    });

    setTimeout(() => {
      answerBoxInputRef.current?.focus();
    }, 0);
  }, [quizTakerDispatch]);

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
          <Map mapId="8777b9e5230900fc" />
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
