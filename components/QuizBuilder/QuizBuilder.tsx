import Map from "@/components/Map";
import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import SplitPane from "@/components/SplitPane";
import Link from "next/link";
import { FocusEvent, useEffect, useRef, useState } from "react";
import { Sublocations } from "./Sublocations";
import { AreaState, LocationType, PointState, QuizDispatchType } from "@/types";

export default function QuizBuilder() {
  const quiz = useQuiz();
  const quizDispatch = useQuizDispatch();

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

  function handleBlurCapture(event: FocusEvent<HTMLDivElement>) {
    const relatedTarget = event.relatedTarget as Node;

    if (
      !sublocationsRef.current?.contains(relatedTarget) &&
      !takeQuizButtonRef.current?.contains(relatedTarget) &&
      !mapRef.current?.contains(relatedTarget)
    ) {
      quizDispatch({
        type: QuizDispatchType.BuildSelected,
        location: null,
      });
    }
  }

  const displayedLocation = quiz.selectedSublocation;

  useEffect(() => {
    if (displayedLocation) {
      if (displayedLocation.locationType === LocationType.Area) {
        if (displayedLocation.isOpen) {
          setEmptyAreas(displayedLocation);
          setFilledAreas(null);
          setBounds(displayedLocation.displayBounds);
        } else {
          if (
            displayedLocation.parentLocation.locationType === LocationType.Quiz
          ) {
            setEmptyAreas(null);
            setBounds(displayedLocation.displayBounds);
          } else if (
            displayedLocation.parentLocation.locationType === LocationType.Area
          ) {
            setEmptyAreas(displayedLocation.parentLocation);
            setBounds(displayedLocation.parentLocation.displayBounds);
          }

          setFilledAreas(displayedLocation);
        }
        setPoints(null);
      } else if (displayedLocation.locationType === LocationType.Point) {
        if (
          displayedLocation.parentLocation.locationType === LocationType.Quiz
        ) {
          const lng = displayedLocation.point.coordinates[0];
          const lat = displayedLocation.point.coordinates[1];
          const diff = 0.1;

          const north = lat + diff;
          const east = lng + diff;
          const south = lat - diff;
          const west = lng - diff;

          setEmptyAreas(null);
          setBounds({ north, east, south, west });
        } else {
          setEmptyAreas(displayedLocation.parentLocation);
          setBounds(displayedLocation.parentLocation.displayBounds);
        }

        setFilledAreas(null);
        setPoints(displayedLocation);
      }
    } else {
      setEmptyAreas(null);
      setFilledAreas(null);
      setPoints(null);
    }
  }, [displayedLocation]);

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
