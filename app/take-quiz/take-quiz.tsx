"use client";

import { Polygon } from "@/components/map";
import { DEFAULT_BOUNDS, RESTRICTION } from "@/components/map/constants";
import { AnswerBox } from "@/components/take-quiz/answer-box";
import { CompleteDialog } from "@/components/take-quiz/complete-dialog";
import { ScoreBox } from "@/components/take-quiz/score-box";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isArea, isChild, isParent, isPoint, isEarth } from "@/helpers";
import { useQuiz, useQuizTaker } from "@/providers";
import { QuizTakerDispatchType } from "@/types";
import { Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useRef, useState } from "react";

const PADDING = 100;

const TakeQuiz = () => {
  const { quiz } = useQuiz();
  const { quizTaker, quizTakerDispatch } = useQuizTaker();
  const map = useMap();

  const displayed = (() => {
    const displayed = quiz.get(quizTaker.currentId);
    if (isChild(displayed)) return displayed;
  })();

  const displayedParent = (() => {
    if (!isChild(displayed)) return;
    const displayedParent = quiz.get(displayed.parentId);
    if (isParent(displayedParent)) return displayedParent;
  })();

  const quizIsComplete = quizTaker.remainingIds.size === 0;

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

  /**TODO: fitBounds cancels early sometimes. Seems to be only on the first
   * call if the zoom is large enough to cause the map to "cut" rather
   * than animate the zoom smoothly. */
  useEffect(() => {
    let bounds: google.maps.LatLngBoundsLiteral;

    if (isArea(displayedParent)) {
      bounds = displayedParent.displayBounds;
    }

    if (isEarth(displayedParent)) {
      bounds = displayed?.displayBounds;
    }

    if (bounds) {
      map?.fitBounds(bounds, PADDING);
    }
  }, [displayed, displayedParent, map, tilesLoaded]);

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
            displayedFeature={displayed}
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
        defaultBounds={displayed?.displayBounds || DEFAULT_BOUNDS}
        onTilesLoaded={() => setTilesLoaded(true)}
      >
        {isArea(displayedParent) && (
          <Polygon
            polygon={displayedParent.polygon}
            strokeWeight={1.5}
            strokeColor="#b91c1c"
            fillOpacity={0}
          />
        )}
        {isArea(displayed) && (
          <Polygon
            polygon={displayed.polygon}
            strokeWeight={1.5}
            strokeColor="#b91c1c"
            fillColor="#b91c1c"
            fillOpacity={0.2}
          />
        )}
        {isPoint(displayed) && (
          <Marker
            position={{
              lng: displayed.point.coordinates[0],
              lat: displayed.point.coordinates[1],
            }}
          />
        )}
      </Map>
    </div>
  );
};

export default TakeQuiz;
