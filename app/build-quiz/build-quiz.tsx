"use client";

import { Polygon } from "@/components/map-drawings";
import { SplitPane } from "@/components/split-pane";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isArea, isChild, isParent, isPoint, isRoot } from "@/helpers";
import { useAllFeatures, useQuizBuilder } from "@/providers";
import { Map, Marker, useMap } from "@vis.gl/react-google-maps";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChildFeatures } from "@/components/quiz-builder/child-features";

const DEFAULT_CENTER = {
  lat: 0,
  lng: 0,
};

const DEFAULT_ZOOM = 1;

const RESTRICTION = {
  latLngBounds: {
    north: 85,
    south: -85,
    west: -180,
    east: 180,
  },
  strictBounds: true,
};

const BuildQuiz = () => {
  const { rootId, allFeatures } = useAllFeatures();

  const {
    quizBuilder: {
      searchResult: featureAdderFeature,
      selectedId,
      addingId,
      openIds,
    },
  } = useQuizBuilder();

  const map = useMap();

  const root = useMemo(() => {
    const root = allFeatures.get(rootId);
    if (isRoot(root)) return root;
  }, [rootId, allFeatures]);

  const rootIsAdding = useMemo(() => rootId === addingId, [rootId, addingId]);

  const displayedFeature = useMemo(() => {
    if (featureAdderFeature) return featureAdderFeature;

    const selectedFeature = allFeatures.get(selectedId);
    return isChild(selectedFeature) && selectedFeature;
  }, [featureAdderFeature, selectedId, allFeatures]);

  const displayedFeatureParent = useMemo(() => {
    if (!isChild(displayedFeature)) return;

    const displayedFeatureParent = allFeatures.get(displayedFeature.parentId);
    if (isParent(displayedFeatureParent)) return displayedFeatureParent;
  }, [displayedFeature, allFeatures]);

  const displayedFeatureIsOpen = openIds.has(displayedFeature?.id);

  const [tilesLoaded, setTilesLoaded] = useState(false);

  const featureAdderInputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (isArea(displayedFeature)) {
      if (!displayedFeatureIsOpen) {
        if (isArea(displayedFeatureParent)) {
          map.fitBounds(displayedFeatureParent.displayBounds);
        }

        if (isRoot(displayedFeatureParent)) {
          /**This is horrible, but only way I've been able to prevent fitBounds
           * from occasionally ending early over long zooms the first time it's
           * called. */
          map.fitBounds(displayedFeature.displayBounds);

          setTimeout(() => {
            map.fitBounds(displayedFeature.displayBounds);
          }, 0);
        }
      }

      if (displayedFeatureIsOpen) {
        map.fitBounds(displayedFeature.displayBounds);
      }
    }
  }, [displayedFeature, displayedFeatureIsOpen, displayedFeatureParent, map]);

  return (
    <>
      {!tilesLoaded && (
        <LoadingSpinner className="absolute left-0 right-0 top-0 z-40 bg-gray-700" />
      )}
      <SplitPane>
        <div className="relative h-full">
          <ChildFeatures
            className={`p-3 overflow-auto custom-scrollbar max-h-[calc(100vh-4rem)]`}
            parent={root}
            isAdding={rootIsAdding}
            featureAdderInputRef={featureAdderInputRef}
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
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={DEFAULT_ZOOM}
          restriction={RESTRICTION}
          onTilesLoaded={() => setTilesLoaded(true)}
        >
          {isArea(displayedFeatureParent) && !displayedFeatureIsOpen && (
            <Polygon
              polygons={displayedFeatureParent.polygon}
              strokeWeight={1.5}
              strokeColor="#b91c1c"
              fillOpacity={0}
            />
          )}
          {isArea(displayedFeature) && (
            <Polygon
              polygons={displayedFeature.polygon}
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
