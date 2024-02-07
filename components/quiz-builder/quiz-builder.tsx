"use client";

import { Map } from "@/components/map";
import { SplitPane } from "@/components/split-pane";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isRootState, isSubfeatureState } from "@/helpers";
import { useAllFeatures, useQuizBuilder } from "@/providers";
import { DisplayMode } from "@/types";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Subfeatures } from "./subfeatures";

type QuizBuilderProps = {
  googleLibsLoaded: boolean;
};

const QuizBuilder = ({ googleLibsLoaded }: QuizBuilderProps) => {
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

  const featureAdderInputRef = useRef<HTMLInputElement>();

  const [mapIsLoaded, setMapIsLoaded] = useState<boolean>(false);

  const handleMapLoad = () => {
    /**TODO: This check shouldn't really be necessary. Need to revise Map so
     * it only fires this once. */
    if (mapIsLoaded) {
      return;
    }

    setMapIsLoaded(true);
    featureAdderInputRef.current?.focus();
  };

  useEffect(() => {
    setTimeout(() => {
      featureAdderInputRef.current?.focus();
    }, 0);
  }, []);

  return (
    <>
      {(!googleLibsLoaded || !mapIsLoaded) && (
        <LoadingSpinner className="absolute left-0 right-0 top-0 z-40 bg-gray-700" />
      )}
      {googleLibsLoaded && (
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
            mapId="696d0ea42431a75c"
            displayedFeature={displayedFeature}
            displayMode={DisplayMode.QUIZ_BUILDER}
            onLoad={handleMapLoad}
          />
        </SplitPane>
      )}
    </>
  );
};

export { QuizBuilder };
