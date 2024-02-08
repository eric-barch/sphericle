"use client";

import { Polygon } from "@/components/map/polygon";
import { SplitPane } from "@/components/split-pane";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isAreaState, isRootState, isSubfeatureState } from "@/helpers";
import { useAllFeatures, useQuizBuilder } from "@/providers";
import {
  Map,
  MapCameraChangedEvent,
  MapCameraProps,
  useMap,
} from "@vis.gl/react-google-maps";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Subfeatures } from "./subfeatures";

const INITIAL_BOUNDS = {
  north: 85,
  south: -85,
  west: -180,
  east: 180,
};

const INITIAL_CAMERA = {
  center: { lat: 0, lng: 0 },
  zoom: 1,
};

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
      featureAdderFeatureState,
      selectedFeatureId,
      addingFeatureId,
      openFeatureIds,
    },
  } = useQuizBuilder();
  const map = useMap();

  const rootState = (() => {
    const rootState = allFeatures.get(rootId);

    if (isRootState(rootState)) {
      return rootState;
    }
  })();
  const rootIsAdding = rootId === addingFeatureId;

  const displayedFeature = (() => {
    if (featureAdderFeatureState) {
      return featureAdderFeatureState;
    }

    const selectedFeatureState = allFeatures.get(selectedFeatureId);

    if (isSubfeatureState(selectedFeatureState)) {
      return selectedFeatureState;
    }
  })();
  const displayedFeatureIsOpen = openFeatureIds.has(
    displayedFeature?.featureId,
  );
  const displayedFeaturePolygons = (() => {
    if (isAreaState(displayedFeature) && !displayedFeatureIsOpen) {
      return displayedFeature.polygons;
    }
  })();
  const parentFeaturePolygons = (() => {
    if (isAreaState(displayedFeature) && displayedFeatureIsOpen) {
      return displayedFeature?.polygons;
    }

    const parentFeatureState = allFeatures.get(
      displayedFeature?.parentFeatureId,
    );

    if (isAreaState(parentFeatureState)) {
      return parentFeatureState.polygons;
    }
  })();

  const [tilesLoaded, setTilesLoaded] = useState(false);
  const [camera, setCamera] = useState<MapCameraProps>(INITIAL_CAMERA);

  const featureAdderInputRef = useRef<HTMLInputElement>();

  const handleCameraChange = (event: MapCameraChangedEvent) => {
    setCamera(event.detail);
  };

  useEffect(() => {
    console.log("displayedFeature", displayedFeature?.shortName);

    if (isAreaState(displayedFeature) && displayedFeatureIsOpen) {
      console.log("setBounds", displayedFeature?.shortName);
      map.fitBounds(displayedFeature.displayBounds);
      // setCamera({
      //   center: displayedFeature.center,
      //   zoom: displayedFeature.zoom,
      // });
      return;
    }

    const parentFeatureState = allFeatures.get(
      displayedFeature?.parentFeatureId,
    );

    if (isAreaState(parentFeatureState)) {
      console.log("setBounds", parentFeatureState?.shortName);
      map.fitBounds(parentFeatureState.displayBounds);
      // setCamera({
      //   center: parentFeatureState.center,
      //   zoom: parentFeatureState.zoom,
      // });
      return;
    }
  }, [displayedFeature, allFeatures, displayedFeatureIsOpen, map]);

  useEffect(() => {
    setTimeout(() => {
      featureAdderInputRef.current?.focus();
    }, 0);
  }, []);

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
            featureState={rootState}
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
          disableDefaultUI
          restriction={RESTRICTION}
          gestureHandling="greedy"
          defaultBounds={INITIAL_BOUNDS}
          // onCameraChanged={handleCameraChange}
          onTilesLoaded={() => setTilesLoaded(true)}
          // {...camera}
        >
          {parentFeaturePolygons && (
            <Polygon
              polygons={parentFeaturePolygons}
              strokeWeight={1.5}
              strokeColor="#ff0000"
              fillOpacity={0}
            />
          )}
          {displayedFeaturePolygons && (
            <Polygon
              polygons={displayedFeaturePolygons}
              strokeWeight={1.5}
              strokeColor="#b91c1c"
              fillColor="#b91c1c"
              fillOpacity={0.2}
            />
          )}
        </Map>
      </SplitPane>
    </>
  );
};

export { QuizBuilder };
