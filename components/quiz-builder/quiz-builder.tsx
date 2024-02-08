"use client";

import { SplitPane } from "@/components/split-pane";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  isAreaState,
  isParentFeatureState,
  isRootState,
  isSubfeatureState,
} from "@/helpers";
import { useAllFeatures, useQuizBuilder } from "@/providers";
import { Map } from "@vis.gl/react-google-maps";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Subfeatures } from "./subfeatures";
import { Polygon } from "@/components/map/polygon";

const INITIAL_CENTER = { lat: 0, lng: 0 };
const INITIAL_ZOOM = 2;
const RESTRICTION = {
  latLngBounds: {
    east: 180,
    west: -180,
    north: 85,
    south: -85,
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
    },
  } = useQuizBuilder();

  const rootState = (() => {
    const rootState = allFeatures.get(rootId);

    if (isRootState(rootState)) {
      return rootState;
    }
  })();
  const isAdding = rootId === addingFeatureId;
  const displayedFeature = (() => {
    if (featureAdderFeatureState) {
      return featureAdderFeatureState;
    }

    const selectedFeatureState = allFeatures.get(selectedFeatureId);

    if (isSubfeatureState(selectedFeatureState)) {
      return selectedFeatureState;
    }
  })();
  const displayedFeatureParent = (() => {
    const parentFeatureState = allFeatures.get(
      displayedFeature?.parentFeatureId,
    );

    if (isAreaState(parentFeatureState)) {
      console.log("parentFeatureState", parentFeatureState);
      return parentFeatureState;
    }
  })();

  const [tilesLoaded, setTilesLoaded] = useState(false);

  const featureAdderInputRef = useRef<HTMLInputElement>();

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
            isAdding={isAdding}
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
          defaultCenter={INITIAL_CENTER}
          defaultZoom={INITIAL_ZOOM}
          restriction={RESTRICTION}
          disableDefaultUI={true}
          onTilesLoaded={() => setTilesLoaded(true)}
        >
          {displayedFeatureParent && (
            <Polygon
              polygons={displayedFeatureParent.polygons}
              strokeWeight={2}
              strokeColor="#ff0000"
              fillOpacity={0}
            />
          )}
        </Map>
      </SplitPane>
    </>
  );
};

export { QuizBuilder };
