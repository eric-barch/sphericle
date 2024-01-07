"use client";

import Map from "@/components/Map";
import { rootId, useQuiz } from "@/components/QuizProvider";
import SplitPane from "@/components/SplitPane";
import { AreaState, DisplayMode, PointState, RootState } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import Sublocations from "./Sublocations";
import { useQuizBuilder } from "./QuizBuilderProvider";

export default function QuizBuilder() {
  const quiz = useQuiz();
  const quizBuilder = useQuizBuilder();

  const [displayedLocation, setDisplayedLocation] = useState<
    RootState | AreaState | PointState | null
  >(quiz[quizBuilder.selectedId] || null);

  useEffect(() => {
    const activeOption = quizBuilder.activeOption;
    const selectedLocation = quiz[quizBuilder.selectedId];
    setDisplayedLocation(activeOption || selectedLocation);
  }, [quiz, quizBuilder]);

  return (
    <SplitPane>
      <div className="relative h-full">
        <Sublocations
          className={`p-3 overflow-auto custom-scrollbar max-h-[calc(100vh-3rem)]`}
          parentId={rootId}
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
        displayedLocation={displayedLocation}
        displayMode={DisplayMode.WITHOUT_SIBLINGS}
      />
    </SplitPane>
  );
}
