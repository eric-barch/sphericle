"use client";

import { Polygon } from "@/components/map";
import { DEFAULT_BOUNDS, RESTRICTION } from "@/components/map/constants";
import { AnswerBox } from "@/components/take-quiz/answer-box";
import { CompleteDialog } from "@/components/take-quiz/complete-dialog";
import { ScoreBox } from "@/components/take-quiz/score-box";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isArea, isChild, isParent, isPoint, isRoot } from "@/helpers";
import { useQuiz, useQuizTaker } from "@/providers";
import { QuizTakerDispatchType } from "@/types";
import { Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useRef, useState } from "react";

const PADDING = 100;

const TakeQuiz = () => {
  const { quiz } = useQuiz();
  const { quizTaker, quizTakerDispatch } = useQuizTaker();
  const map = useMap();

  const displayedFeature = (() => {
    const displayedFeature = quiz.get(quizTaker.currentId);
    if (isChild(displayedFeature)) return displayedFeature;
  })();

  const displayedFeatureParent = (() => {
    if (!isChild(displayedFeature)) return;
    const displayedFeatureParent = quiz.get(displayedFeature.parentId);
    if (isParent(displayedFeatureParent)) return displayedFeatureParent;
  })();

  const quizIsComplete = quizTaker.remainingIds.size === 0;

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

  /**TODO: fitBounds cancels early sometimes. Seems to be only on the first
   * call if the zoom is large enough to cause the map to "cut" rather
   * than animate the zoom smoothly. */
  useEffect(() => {
    /**Must check if map is idle before fitting bounds. */
    if (!isIdle) return;

    let bounds: google.maps.LatLngBoundsLiteral;

    if (isArea(displayedFeatureParent)) {
      bounds = displayedFeatureParent.displayBounds;
    }

    if (isRoot(displayedFeatureParent)) {
      bounds = displayedFeature?.displayBounds;
    }

    if (bounds) {
      map?.fitBounds(bounds, PADDING);
    }
  }, [displayedFeature, displayedFeatureParent, isIdle, map, tilesLoaded]);

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
            disabled={quizIsComplete}
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
