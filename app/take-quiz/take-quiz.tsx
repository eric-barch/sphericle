"use client";

import { Polygon } from "@/components/map";
import { DEFAULT_BOUNDS, RESTRICTION } from "@/components/map/constants";
import { Nav } from "@/components/nav";
import { AnswerBox } from "@/components/take-quiz/answer-box";
import { CompleteDialog } from "@/components/take-quiz/complete-dialog";
import { ScoreBox } from "@/components/take-quiz/score-box";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isArea, isChild, isEarth, isParent, isPoint } from "@/helpers";
import { useQuiz, useQuizTaker } from "@/providers";
import { QuizTakerDispatchType } from "@/types";
import { Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";

const PADDING = 100;

const TakeQuiz = () => {
  const { quiz } = useQuiz();
  const { quizTaker, quizTakerDispatch } = useQuizTaker();
  const map = useMap();
  const { resolvedTheme } = useTheme();

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

  const [tilesAreLoaded, setTilesAreLoaded] = useState<boolean>(false);
  const [mapIsIdle, setMapIsIdle] = useState<boolean>(true);
  const [mapIsLoaded, setMapIsLoaded] = useState<boolean>(false);
  const [targetBounds, setTargetBounds] =
    useState<google.maps.LatLngBoundsLiteral>(DEFAULT_BOUNDS);

  const handleTilesLoaded = () => {
    setTilesAreLoaded(true);
  };

  const handleIdle = () => {
    setMapIsIdle(true);
  };

  const handleBoundsChanged = () => {
    setMapIsIdle(false);
    setTilesAreLoaded(false);
  };

  const handleReset = useCallback(() => {
    quizTakerDispatch({
      type: QuizTakerDispatchType.RESET,
    });

    setTimeout(() => {
      answerBoxRef.current?.focus();
    }, 0);
  }, [quizTakerDispatch]);

  /**Set mapIsLoaded on first load. */
  useEffect(() => {
    if (mapIsIdle && tilesAreLoaded) {
      setMapIsLoaded(true);
    }
  }, [mapIsIdle, tilesAreLoaded]);

  /**Update targetBounds whenever displayed or displayedParent changes.*/
  useEffect(() => {
    let targetBounds: google.maps.LatLngBoundsLiteral;

    if (isArea(displayedParent)) {
      targetBounds = displayedParent.displayBounds;
    }

    if (isEarth(displayedParent)) {
      targetBounds = displayed?.displayBounds;
    }

    if (!targetBounds) return;

    setTargetBounds(targetBounds);
  }, [displayed, displayedParent]);

  /**Call fitBounds on the map ref when targetBounds change. */
  useEffect(() => {
    if (!map || !mapIsLoaded || !targetBounds) return;

    const lat = (targetBounds.north + targetBounds.south) / 2;
    const lng = (targetBounds.east + targetBounds.west) / 2;

    map.fitBounds(targetBounds, PADDING);
    map.setCenter({ lat, lng });
  }, [map, mapIsLoaded, targetBounds]);

  /**Reset quiz when page mounts. */
  useEffect(() => {
    handleReset();
  }, [handleReset]);

  return (
    <>
      <Nav />
      <div className="h-[calc(100vh-4rem)] relative flex justify-center align-middle content-center">
        {!mapIsLoaded && (
          <LoadingSpinner className="absolute z-10 bg-white dark:bg-gray-1" />
        )}
        {mapIsLoaded && (
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
          mapId={
            resolvedTheme === "dark" ? "8777b9e5230900fc" : "a963079063b1cef3"
          }
          gestureHandling="greedy"
          disableDefaultUI
          restriction={RESTRICTION}
          defaultBounds={displayed?.displayBounds || DEFAULT_BOUNDS}
          onTilesLoaded={() => setTilesAreLoaded(true)}
          onBoundsChanged={() => setMapIsIdle(false)}
          onIdle={() => setMapIsIdle(true)}
        >
          {isArea(displayedParent) && (
            <Polygon
              geoJson={displayedParent.polygon}
              strokeWeight={1.5}
              strokeColor="#b91c1c"
              fillOpacity={0}
            />
          )}
          {isArea(displayed) && (
            <Polygon
              geoJson={displayed.polygon}
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
    </>
  );
};

export default TakeQuiz;
