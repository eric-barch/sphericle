"use client";

import Map from "@/components/Map";
import { useAllFeatures } from "@/components/AllFeaturesProvider";
import SplitPane from "@/components/SplitPane";
import { AreaState, DisplayMode, PointState, RootState } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import Subfeatures from "./Subfeatures";
import { useQuizBuilder } from "./QuizBuilderStateProvider";

export default function QuizBuilder() {
  const { rootId, allFeatures } = useAllFeatures();
  const quizBuilder = useQuizBuilder();

  const [displayedFeature, setDisplayedFeature] = useState<
    RootState | AreaState | PointState | null
  >(allFeatures.get(quizBuilder.selectedId) || null);

  useEffect(() => {
    const activeOption = quizBuilder.activeOption;
    const selectedLocation = allFeatures.get(quizBuilder.selectedId);
    setDisplayedFeature(activeOption || selectedLocation);
  }, [allFeatures, quizBuilder]);

  return (
    <SplitPane>
      <div className="relative h-full">
        <Subfeatures
          className={`p-3 overflow-auto custom-scrollbar max-h-[calc(100vh-3rem)]`}
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
        mapId="696d0ea42431a75c"
        displayedFeature={displayedFeature}
        displayMode={DisplayMode.QUIZ_BUILDER}
      />
    </SplitPane>
  );
}
