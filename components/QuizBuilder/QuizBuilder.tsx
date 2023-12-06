import Map from "@/components/Map";
import { useQuiz } from "@/components/QuizProvider";
import SplitPane from "@/components/SplitPane";
import { AreaState, PointState } from "@/types";
import Link from "next/link";
import { FocusEvent, useEffect, useRef, useState } from "react";
import ParentLocationProvider from "./ParentLocationProvider";
import { getQuizBuilderLocationMapItems } from "./QuizBuilder.helpers";
import { Sublocations } from "./Sublocations";

export default function QuizBuilder() {
  const quiz = useQuiz();

  const [placesLoaded, setPlacesLoaded] = useState<boolean>(false);
  const [bounds, setBounds] = useState<google.maps.LatLngBoundsLiteral>(null);
  const [emptyAreas, setEmptyAreas] = useState<AreaState[] | AreaState | null>(
    null,
  );
  const [filledAreas, setFilledAreas] = useState<
    AreaState[] | AreaState | null
  >(null);
  const [points, setPoints] = useState<PointState[] | PointState | null>(null);

  const sublocationsRef = useRef<HTMLDivElement>();
  const takeQuizButtonRef = useRef<HTMLAnchorElement>();
  const mapRef = useRef<HTMLDivElement>();

  useEffect(() => {
    (async function loadPlacesLibrary() {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        await google.maps.importLibrary("places");
        setPlacesLoaded(true);
      } else {
        setPlacesLoaded(true);
      }
    })();
  }, []);

  const builderSelected = quiz.builderSelected;

  useEffect(() => {
    if (builderSelected) {
      const {
        bounds = null,
        emptyAreas,
        filledAreas,
        points,
      } = getQuizBuilderLocationMapItems(builderSelected);

      if (bounds) {
        setBounds(bounds);
      }

      setEmptyAreas(emptyAreas);
      setFilledAreas(filledAreas);
      setPoints(points);
    }
  }, [builderSelected]);

  function handleBlurCapture(event: FocusEvent<HTMLDivElement>) {
    const relatedTarget = event.relatedTarget as Node;

    if (
      !sublocationsRef.current?.contains(relatedTarget) &&
      !takeQuizButtonRef.current?.contains(relatedTarget) &&
      !mapRef.current?.contains(relatedTarget)
    ) {
      // quizDispatch({
      //   type: QuizDispatchType.SelectedBuilderLocation,
      //   location: null,
      // });
    }
  }

  return (
    <>
      {placesLoaded ? (
        <SplitPane>
          <div className="relative h-full">
            <ParentLocationProvider initialParentLocation={quiz}>
              <Sublocations
                sublocationsRef={sublocationsRef}
                className={`p-3 overflow-auto custom-scrollbar max-h-[calc(100vh-48px)]`}
                onBlurCapture={handleBlurCapture}
              />
            </ParentLocationProvider>
            <Link
              ref={takeQuizButtonRef}
              className="absolute bottom-0 right-0 rounded-3xl px-3 py-2 bg-green-700 m-3"
              href="/take-quiz"
            >
              Take Quiz
            </Link>
          </div>
          <Map
            mapRef={mapRef}
            mapId="696d0ea42431a75c"
            bounds={bounds}
            emptyAreas={emptyAreas}
            filledAreas={filledAreas}
            points={points}
          />
        </SplitPane>
      ) : (
        "Loading..."
      )}
    </>
  );
}
