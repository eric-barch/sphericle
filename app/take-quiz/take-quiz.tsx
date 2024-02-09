"use client";

import { Polygon } from "@/components/map";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  RESTRICTION,
} from "@/components/map/constants";
import { AnswerBox } from "@/components/take-quiz/answer-box";
import { CompleteDialog } from "@/components/take-quiz/complete-dialog";
import { ScoreBox } from "@/components/take-quiz/score-box";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isArea, isChild, isParent, isPoint, isRoot } from "@/helpers";
import { useAllFeatures, useQuizTaker } from "@/providers";
import { QuizTakerDispatchType } from "@/types";
import { Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

  const displayedFeatureParent = useMemo(() => {
    if (!isChild(displayedFeature)) return;
    const displayedFeatureParent = allFeatures.get(displayedFeature.parentId);
    if (isParent(displayedFeatureParent)) return displayedFeatureParent;
  }, [allFeatures, displayedFeature]);

  const isComplete = quizTaker.remainingIds.size === 0;

  const answerBoxRef = useRef<HTMLInputElement>();

  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
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

  const handleTilesLoaded = () => {
    console.log("tiles loaded");
    setMapLoaded(true);
    setTilesLoaded(true);
  };

  const handleBoundsChanged = () => {
    console.log("bounds changed");
    setIsIdle(false);
    setTilesLoaded(false);
  };

  const handleIdle = () => {
    console.log("idle");
    setIsIdle(true);
  };

  useEffect(() => {
    if (!isIdle || !tilesLoaded) return;

    if (isArea(displayedFeatureParent)) {
      setTimeout(() => {
        map.fitBounds(displayedFeatureParent.displayBounds, 100);
      }, 0);
    }

    if (isRoot(displayedFeatureParent)) {
      setTimeout(() => {
        map.fitBounds(displayedFeature.displayBounds, 100);
      }, 0);
    }
  }, [map, displayedFeature, displayedFeatureParent, isIdle, tilesLoaded]);

  /**Reset quiz on mount. */
  useEffect(() => {
    handleReset();
  }, [handleReset]);

  return (
    <>
      {!mapLoaded && (
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
            onTilesLoaded={handleTilesLoaded}
            onBoundsChanged={handleBoundsChanged}
            onIdle={handleIdle}
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
