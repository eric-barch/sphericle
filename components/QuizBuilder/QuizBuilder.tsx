"use client";

import Map from "@/components/Map";
import { rootId, useQuiz } from "@/components/QuizProvider";
import SplitPane from "@/components/SplitPane";
import { AreaState, DisplayMode, PointState, RootState } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import Sublocations from "./Sublocations";

export default function QuizBuilder() {
  const quiz = useQuiz();

  const [displayedLocation, setDisplayedLocation] = useState<
    RootState | AreaState | PointState | null
  >(quiz.locations[quiz.selected] || null);

  useEffect(() => {
    setDisplayedLocation(quiz.locations[quiz.selected]);
  }, [quiz]);

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
