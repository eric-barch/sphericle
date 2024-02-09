"use client";

import { Polygon } from "@/components/map";
import { DEFAULT_BOUNDS, RESTRICTION } from "@/components/map/constants";
import { AnswerBox } from "@/components/take-quiz/answer-box";
import { CompleteDialog } from "@/components/take-quiz/complete-dialog";
import { ScoreBox } from "@/components/take-quiz/score-box";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isArea, isChild, isParent, isPoint } from "@/helpers";
import { useAllFeatures, useQuizTaker } from "@/providers";
import { QuizTakerDispatchType } from "@/types";
import { Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PADDING = 100;

const TakeQuiz = () => {
  const { allFeatures } = useAllFeatures();
  const { quizTaker, quizTakerDispatch } = useQuizTaker();
  const map = useMap();

  const displayedFeature = useMemo(() => {
    const displayedFeature = allFeatures.get(quizTaker.currentId);
    if (isChild(displayedFeature)) return displayedFeature;
  }, [allFeatures, quizTaker.currentId]);

  const displayedFeatureParent = (() => {
    if (!isChild(displayedFeature)) return;
    const displayedFeatureParent = allFeatures.get(displayedFeature.parentId);
    if (isParent(displayedFeatureParent)) return displayedFeatureParent;
  })();

  const isComplete = quizTaker.remainingIds.size === 0;

  const answerBoxRef = useRef<HTMLInputElement>();

  const [tilesLoaded, setTilesLoaded] = useState<boolean>(false);
  const [isIdle, setIsIdle] = useState<boolean>(false);

  const handleReset = useCallback(() => {
    quizTakerDispatch({
      type: QuizTakerDispatchType.RESET,
    });

    setTimeout(() => {
      answerBoxRef.current?.focus();
    }, 0);
  }, [quizTakerDispatch]);

  /**Set Map bounds when displayedFeature changes. */
  useEffect(() => {
    const bounds = isArea(displayedFeatureParent)
      ? displayedFeatureParent.displayBounds
      : displayedFeature?.displayBounds;

    setTimeout(() => {
      map?.fitBounds(bounds, PADDING);
    }, 0);
  }, [displayedFeature, displayedFeatureParent, isIdle, map, tilesLoaded]);

  /**Reset quiz on mount. */
  useEffect(() => {
    handleReset();
  }, [handleReset]);

  return (
    <div className="h-[calc(100vh-4rem)] relative flex justify-center align-middle content-center">
      {!tilesLoaded && <LoadingSpinner className="absolute z-10 bg-gray-700" />}
      {tilesLoaded && (
        <>
          <CompleteDialog handleReset={handleReset} />
          <ScoreBox />
          <AnswerBox
            ref={answerBoxRef}
            displayedFeature={displayedFeature}
            disabled={isComplete}
          />
        </>
      )}
      <Map
        className="h-full w-full outline-none border-none"
        mapId="8777b9e5230900fc"
        gestureHandling="greedy"
        disableDefaultUI
        restriction={RESTRICTION}
        defaultBounds={displayedFeature?.displayBounds || DEFAULT_BOUNDS}
        onTilesLoaded={() => setTilesLoaded(true)}
        onBoundsChanged={() => setIsIdle(false)}
        onIdle={() => setIsIdle(true)}
      >
        {isArea(displayedFeatureParent) && (
          <Polygon
            polygon={displayedFeatureParent.polygon}
            strokeWeight={1.5}
            strokeColor="#b91c1c"
            fillOpacity={0}
          />
        )}
        {isArea(displayedFeature) && (
          <Polygon
            polygon={displayedFeature.polygon}
            strokeWeight={1.5}
            strokeColor="#b91c1c"
            fillColor="#b91c1c"
            fillOpacity={0.2}
          />
        )}
        {isPoint(displayedFeature) && (
          <Marker
            position={{
              lng: displayedFeature.point.coordinates[0],
              lat: displayedFeature.point.coordinates[1],
            }}
          />
        )}
      </Map>
    </div>
  );
};

export default TakeQuiz;
