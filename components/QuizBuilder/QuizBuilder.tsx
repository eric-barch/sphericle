import Map from "@/components/Map";
import { useQuiz, useSetQuiz } from "@/components/QuizProvider";
import SplitPane from "@/components/SplitPane";
import Link from "next/link";
import { MouseEvent, useEffect, useState } from "react";
import { Sublocations } from "./Sublocations";

export default function QuizBuilder() {
  const [placesLoaded, setPlacesLoaded] = useState<boolean>(false);

  const quiz = useQuiz();
  const setQuiz = useSetQuiz();

  useEffect(() => {
    async function loadPlacesLibrary() {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        await google.maps.importLibrary("places");
        setPlacesLoaded(true);
      } else {
        setPlacesLoaded(true);
      }
    }

    loadPlacesLibrary();
  }, []);

  function handleMouseDown(event: MouseEvent<HTMLAnchorElement>) {
    console.log(event.relatedTarget);
  }

  return (
    <>
      {placesLoaded ? (
        <SplitPane>
          <div className="relative h-full">
            <Sublocations
              className={`p-3 overflow-auto custom-scrollbar max-h-[calc(100vh-48px)]`}
              parentState={quiz}
              setParentState={setQuiz}
            />
            <Link
              className="absolute bottom-0 right-0 rounded-3xl px-3 py-2 bg-green-700 m-3"
              onMouseDown={handleMouseDown}
              href="/take-quiz"
            >
              Take Quiz
            </Link>
          </div>
          <Map
            mapId="696d0ea42431a75c"
            displayedLocation={quiz.selectedSublocation}
          />
        </SplitPane>
      ) : (
        "Loading..."
      )}
    </>
  );
}
