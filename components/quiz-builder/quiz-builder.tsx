"use client";

import { SplitPane } from "@/components/split-pane";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isRootState, isSubfeatureState } from "@/helpers";
import { useAllFeatures, useQuizBuilder } from "@/providers";
import { DisplayMode } from "@/types";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Subfeatures } from "./subfeatures";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

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
  const displayedFeature = (() => {
    if (featureAdderFeatureState) {
      return featureAdderFeatureState;
    }

    const selectedFeatureState = allFeatures.get(selectedFeatureId);

    if (isSubfeatureState(selectedFeatureState)) {
      return selectedFeatureState;
    }
  })();
  const isAdding = rootId === addingFeatureId;
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

  const featureAdderInputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    setTimeout(() => {
      featureAdderInputRef.current?.focus();
    }, 0);
  }, []);

  return (
    <>
      {!servicesReady && (
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
        />
      </SplitPane>
    </>
  );
};

export { QuizBuilder };
