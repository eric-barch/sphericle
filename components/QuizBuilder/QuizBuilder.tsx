import Map from "@/components/Map";
import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import SplitPane from "@/components/SplitPane";
import Link from "next/link";
import { FocusEvent, useEffect, useRef, useState } from "react";
import { Sublocations } from "./Sublocations";
import { QuizDispatchType } from "@/types";

export default function QuizBuilder() {
  const quiz = useQuiz();
  const quizDispatch = useQuizDispatch();

  const [placesLoaded, setPlacesLoaded] = useState<boolean>(false);

  const sublocationsRef = useRef<HTMLDivElement>();
  const mapRef = useRef<HTMLDivElement>();

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

  function handleBlurCapture(event: FocusEvent<HTMLDivElement>) {
    const relatedTarget = event.relatedTarget;

    if (
      (!sublocationsRef.current?.contains(relatedTarget) &&
        !mapRef.current?.contains(relatedTarget)) ||
      relatedTarget === null
    ) {
      quizDispatch({
        type: QuizDispatchType.Selected,
        location: null,
      });
    }
  }

  // useEffect(() => {
  //   console.log("quiz", quiz);
  // }, [quiz]);

  return (
    <>
      {placesLoaded ? (
        <SplitPane>
          <div className="relative h-full">
            <Sublocations
              sublocationsRef={sublocationsRef}
              className={`p-3 overflow-auto custom-scrollbar max-h-[calc(100vh-48px)]`}
              parent={quiz}
              onBlurCapture={handleBlurCapture}
            />
            <Link
              className="absolute bottom-0 right-0 rounded-3xl px-3 py-2 bg-green-700 m-3"
              href="/take-quiz"
            >
              Take Quiz
            </Link>
          </div>
          <Map
            mapRef={mapRef}
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
