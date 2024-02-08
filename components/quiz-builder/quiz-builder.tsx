"use client";

import { Polygon } from "@/components/map-drawings/polygon";
import { SplitPane } from "@/components/split-pane";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  isAreaState as isArea,
  isParentFeatureState as isParentFeature,
  isPointState as isPoint,
  isRootState as isRoot,
  isSubfeatureState as isSubfeature,
} from "@/helpers";
import { useAllFeatures, useQuizBuilder } from "@/providers";
import { Map, Marker, useMap } from "@vis.gl/react-google-maps";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Subfeatures } from "./subfeatures";

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

type QuizBuilderProps = {
  servicesReady: boolean;
};

const QuizBuilder = ({ servicesReady }: QuizBuilderProps) => {
  const { rootId, allFeatures } = useAllFeatures();
  const {
    quizBuilder: {
      featureAdderFeature,
      selectedFeatureId,
      addingFeatureId,
      openFeatureIds,
    },
  } = useQuizBuilder();
  const map = useMap();

  const root = useMemo(() => {
    const root = allFeatures.get(rootId);

    if (isRoot(root)) {
      return root;
    }
  }, [rootId, allFeatures]);
  const rootIsAdding = useMemo(
    () => rootId === addingFeatureId,
    [rootId, addingFeatureId],
  );

  const displayedFeature = useMemo(() => {
    if (featureAdderFeature) {
      return featureAdderFeature;
    }

    const selectedFeature = allFeatures.get(selectedFeatureId);

    if (isSubfeature(selectedFeature)) {
      return selectedFeature;
    }
  }, [featureAdderFeature, selectedFeatureId, allFeatures]);
  const displayedFeatureParent = useMemo(() => {
    if (isSubfeature(displayedFeature)) {
      const displayedFeatureParent = allFeatures.get(
        displayedFeature.parentFeatureId,
      );

      if (isParentFeature(displayedFeatureParent)) {
        return displayedFeatureParent;
      }
    }
  }, [displayedFeature, allFeatures]);
  const displayedFeatureIsOpen = openFeatureIds.has(
    displayedFeature?.featureId,
  );

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
      {(!servicesReady || !tilesLoaded) && (
        <LoadingSpinner className="absolute left-0 right-0 top-0 z-40 bg-gray-700" />
      )}
      <SplitPane>
        <div className="relative h-full">
          <Subfeatures
            featureAdderInputRef={featureAdderInputRef}
            className={`p-3 overflow-auto custom-scrollbar max-h-[calc(100vh-4rem)]`}
            featureState={root}
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
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={DEFAULT_ZOOM}
          restriction={RESTRICTION}
          onTilesLoaded={() => setTilesLoaded(true)}
        >
          {isArea(displayedFeatureParent) && !displayedFeatureIsOpen && (
            <Polygon
              polygons={displayedFeatureParent.polygons}
              strokeWeight={1.5}
              strokeColor="#b91c1c"
              fillOpacity={0}
            />
          )}
          {isArea(displayedFeature) && (
            <Polygon
              polygons={displayedFeature.polygons}
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

export { QuizBuilder };
