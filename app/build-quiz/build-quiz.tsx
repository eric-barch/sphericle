"use client";

import { ChildFeatures } from "@/components/build-quiz/child-features";
import { Polygon } from "@/components/map";
import {
  DEFAULT_BOUNDS,
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  RESTRICTION,
} from "@/components/map/constants";
import { SplitPane } from "@/components/split-pane";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isArea, isChild, isParent, isPoint, isRoot } from "@/helpers";
import { useAllFeatures, useQuizBuilder } from "@/providers";
import { Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { set } from "lodash";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const BuildQuiz = () => {
  const { rootId, allFeatures } = useAllFeatures();
  const { quizBuilder } = useQuizBuilder();
  const map = useMap();

  const root = (() => {
    const root = allFeatures.get(rootId);
    if (isRoot(root)) return root;
  })();

  const rootIsAdding = useMemo(
    () => rootId === quizBuilder.addingId,
    [rootId, quizBuilder.addingId],
  );

  const displayedFeature = useMemo(() => {
    if (quizBuilder.searchResult) return quizBuilder.searchResult;
    const selectedFeature = allFeatures.get(quizBuilder.selectedId);
    if (isChild(selectedFeature)) return selectedFeature;
  }, [allFeatures, quizBuilder.searchResult, quizBuilder.selectedId]);

  const displayedFeatureParent = useMemo(() => {
    if (!isChild(displayedFeature)) return;
    const displayedFeatureParent = allFeatures.get(displayedFeature.parentId);
    if (isParent(displayedFeatureParent)) return displayedFeatureParent;
  }, [allFeatures, displayedFeature]);

  const displayedFeatureIsOpen = quizBuilder.openIds.has(displayedFeature?.id);

  const featureAdderInputRef = useRef<HTMLInputElement>();

  const [tilesLoaded, setTilesLoaded] = useState(false);
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let bounds: google.maps.LatLngBoundsLiteral;

    if (isArea(displayedFeature)) {
      if (displayedFeatureIsOpen) {
        bounds = displayedFeature.displayBounds;
      }

      if (!displayedFeatureIsOpen) {
        if (isArea(displayedFeatureParent)) {
          bounds = displayedFeatureParent.displayBounds;
        }

        if (isRoot(displayedFeatureParent)) {
          bounds = displayedFeature.displayBounds;
        }
      }
    }

    if (isPoint(displayedFeature)) {
      if (isArea(displayedFeatureParent)) {
        bounds = displayedFeatureParent.displayBounds;
      }

      if (isRoot(displayedFeatureParent)) {
        bounds = displayedFeature.displayBounds;
      }
    }

    if (bounds) map?.fitBounds(bounds);
  }, [
    displayedFeature,
    displayedFeatureIsOpen,
    displayedFeatureParent,
    isIdle,
    map,
  ]);

  return (
    <>
      {!tilesLoaded && (
        <LoadingSpinner className="absolute left-0 right-0 top-0 z-40 bg-gray-700" />
      )}
      <SplitPane>
        <div className="relative h-full">
          <ChildFeatures
            className={`p-3 overflow-auto custom-scrollbar max-h-[calc(100vh-4rem)]`}
            adderInputRef={featureAdderInputRef}
            parent={root}
            isAdding={rootIsAdding}
          />
          <Link
            className="absolute bottom-0 right-0 rounded-3xl px-3 py-2 bg-green-700 m-3"
            href="/take-quiz"
          >
            Take Quiz
          </Link>
        </div>
        <Map
          className="h-full w-full outline-none border-none"
          mapId="696d0ea42431a75c"
          gestureHandling="greedy"
          disableDefaultUI
          restriction={RESTRICTION}
          defaultBounds={displayedFeature?.displayBounds || DEFAULT_BOUNDS}
          onTilesLoaded={() => setTilesLoaded(true)}
          onBoundsChanged={() => setIsIdle(false)}
          onIdle={() => setIsIdle(true)}
        >
          {!displayedFeatureIsOpen && isArea(displayedFeatureParent) && (
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
              fillOpacity={displayedFeatureIsOpen ? 0 : 0.2}
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
      </SplitPane>
    </>
  );
};

export default BuildQuiz;
