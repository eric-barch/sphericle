"use client";

import { useAllFeatures } from "@/components/all-features-provider";
import LoadingSpinner from "@/components/ui/loading-spinner";
import Map from "@/components/map";
import SplitPane from "@/components/split-pane";
import {
  isParentFeatureState,
  isSubfeatureState,
} from "@/helpers/feature-type-guards";
import { DisplayMode } from "@/types";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useQuizBuilderState } from "./quiz-builder-state-provider";
import Subfeatures from "./subfeatures";

interface QuizBuilderProps {
  googleLibsLoaded: boolean;
}

export default function QuizBuilder({ googleLibsLoaded }: QuizBuilderProps) {
  const { rootId, allFeatures } = useAllFeatures();
  const { quizBuilderState } = useQuizBuilderState();

  const rootState = useMemo(() => {
    const newRootState = allFeatures.get(rootId);
    return isParentFeatureState(newRootState) ? newRootState : null;
  }, [allFeatures, rootId]);
  const displayedFeature = useMemo(() => {
    const {
      featureAdderFeatureState: activeSearchOption,
      selectedFeatureId: selectedFeatureId,
    } = quizBuilderState;
    const selectedFeature = allFeatures.get(selectedFeatureId);
    return (
      activeSearchOption ||
      (isSubfeatureState(selectedFeature) && selectedFeature)
    );
  }, [allFeatures, quizBuilderState]);
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