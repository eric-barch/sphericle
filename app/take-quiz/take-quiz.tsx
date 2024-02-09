"use client";

import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  RESTRICTION,
} from "@/components/map/constants";
import { AnswerBox } from "@/components/take-quiz/answer-box";
import { CompleteDialog } from "@/components/take-quiz/complete-dialog";
import { ScoreBox } from "@/components/take-quiz/score-box";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isArea, isChild, isParent, isRoot } from "@/helpers";
import { useAllFeatures, useQuizTaker } from "@/providers";
import { QuizTakerDispatchType } from "@/types";
import { Map, useMap } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useRef, useState } from "react";

const TakeQuiz = () => {
  const { allFeatures } = useAllFeatures();
  const { quizTaker, quizTakerDispatch } = useQuizTaker();
  const map = useMap();

  const displayedFeature = (() => {
    const displayedFeature = allFeatures.get(
      quizTaker.remainingIds.values().next().value,
    );

    if (isChild(displayedFeature)) return displayedFeature;
  })();

  const displayedFeatureParent = (() => {
    if (!isChild(displayedFeature)) return;
    const displayedFeatureParent = allFeatures.get(displayedFeature.parentId);
    if (isParent(displayedFeatureParent)) return displayedFeatureParent;
  })();

  const isComplete = quizTaker.remainingIds.size === 0;

  const answerBoxRef = useRef<HTMLInputElement>();

  const [tilesLoaded, setTilesLoaded] = useState<boolean>(false);

  const handleReset = useCallback(() => {
    quizTakerDispatch({
      type: QuizTakerDispatchType.RESET,
    });

    setTimeout(() => {
      answerBoxRef.current?.focus();
    }, 0);
  }, [quizTakerDispatch]);

  useEffect(() => {
    if (!map) return;

    if (isArea(displayedFeatureParent)) {
      map.fitBounds(displayedFeatureParent.displayBounds);
    }

    if (isRoot(displayedFeatureParent)) {
      map.fitBounds(displayedFeature.displayBounds);
    }
  }, [map, displayedFeature, displayedFeatureParent]);

  /**Reset quiz on mount. */
  useEffect(() => {
    handleReset();
  }, [handleReset]);

  return (
    <>
      {!tilesLoaded && (
        <LoadingSpinner className="absolute left-0 right-0 top-0 z-40 bg-gray-700" />
      )}
      {
        <div className="h-[calc(100vh-4rem)] relative flex justify-center align-middle content-center">
          <CompleteDialog handleReset={handleReset} />
          <ScoreBox />
          <Map
            className="h-full w-full outline-none border-none"
            mapId="8777b9e5230900fc"
            gestureHandling="greedy"
            disableDefaultUI
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={DEFAULT_ZOOM}
            restriction={RESTRICTION}
            onTilesLoaded={() => setTilesLoaded(true)}
          ></Map>
          <AnswerBox
            displayedFeature={displayedFeature}
            inputRef={answerBoxRef}
            disabled={isComplete}
          />
        </div>
      }
    </>
  );
};

export default TakeQuiz;
