"use client";

import { useAllFeatures } from "@/components/all-features-provider";
import Map from "@/components/map";
import SplitPane from "@/components/split-pane";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { isRootState, isSubfeatureState } from "@/helpers/feature-type-guards";
import { DisplayMode } from "@/types";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useQuizBuilderState } from "./quiz-builder-state-provider";
import Subfeatures from "./subfeatures";

interface QuizBuilderProps {
  googleLibsLoaded: boolean;
}

export default function QuizBuilder({ googleLibsLoaded }: QuizBuilderProps) {
  const { rootId, allFeatures } = useAllFeatures();
  const { quizBuilderState, quizBuilderStateDispatch } = useQuizBuilderState();

  useEffect(() => {
    console.log(quizBuilderState);
  }, [quizBuilderState]);

  const rootState = (() => {
    const newRootState = allFeatures.get(rootId);
    return isRootState(newRootState) ? newRootState : undefined;
  })();
  const displayedFeature = (() => {
    const featureAdderSelectedFeatureState =
      quizBuilderState.featureAdderSelectedFeatureState;
    const selectedFeatureState = allFeatures.get(
      quizBuilderState.selectedFeatureId,
    );

    if (featureAdderSelectedFeatureState) {
      return featureAdderSelectedFeatureState;
    }

    if (isSubfeatureState(selectedFeatureState)) {
      return selectedFeatureState;
    }
  })();

  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  const handleMapLoad = useCallback(() => {
    setMapLoaded(true);
  }, []);

  return (
    <>
      {!googleLibsLoaded || !mapLoaded ? (
        <LoadingSpinner className="absolute left-0 right-0 top-0 z-40 bg-gray-700" />
      ) : null}
      {googleLibsLoaded ? (
        <SplitPane>
          <div className="relative h-full">
            <Subfeatures
              className={`p-3 overflow-auto custom-scrollbar max-h-[calc(100vh-4rem)]`}
              isAdding
              parentFeatureState={rootState}
            />
            <Link
              className="absolute bottom-0 right-0 rounded-3xl px-3 py-2 bg-green-700 m-3"
              href="/take-quiz"
            >
              Take Quiz
            </Link>
          </div>
          <Map
            onLoad={handleMapLoad}
            mapId="696d0ea42431a75c"
            displayedFeature={displayedFeature}
            displayMode={DisplayMode.QUIZ_BUILDER}
          />
        </SplitPane>
      ) : null}
    </>
  );
}
