"use client";

import { useAllFeatures } from "@/components/AllFeaturesProvider";
import Map from "@/components/Map";
import SplitPane from "@/components/SplitPane";
import { AreaState, DisplayMode, PointState, RootState } from "@/types";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { useQuizBuilderState } from "./QuizBuilderStateProvider";
import Subfeatures from "./Subfeatures";

interface QuizBuilderProps {
  googleLibsLoaded: boolean;
}

export default function QuizBuilder({ googleLibsLoaded }: QuizBuilderProps) {
  const { rootId, allFeatures } = useAllFeatures();
  const { quizBuilderState } = useQuizBuilderState();

  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [displayedFeature, setDisplayedFeature] = useState<
    RootState | AreaState | PointState | null
  >(null);

  useEffect(() => {
    console.log("\nopenAreas", quizBuilderState.openParentFeatures.size);
    console.log("addingAreas", quizBuilderState.addingParentFeatures.size);

    const activeOption = quizBuilderState.activeSearchOption;
    const selectedFeature = allFeatures.get(quizBuilderState.selectedFeatureId);

    setDisplayedFeature(activeOption || selectedFeature);
  }, [allFeatures, quizBuilderState]);

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
              parentFeatureId={rootId}
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
