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

  const buildSelected = quiz.buildSelected;

  useEffect(() => {
    if (buildSelected) {
      if (buildSelected.locationType === LocationType.Area) {
        if (buildSelected.isOpen) {
          setEmptyAreas(buildSelected);
          setFilledAreas(null);
          setBounds(buildSelected.displayBounds);
        } else {
          if (buildSelected.parentLocation.locationType === LocationType.Quiz) {
            setEmptyAreas(null);
            setBounds(buildSelected.displayBounds);
          } else if (
            buildSelected.parentLocation.locationType === LocationType.Area
          ) {
            setEmptyAreas(buildSelected.parentLocation);
            setBounds(buildSelected.parentLocation.displayBounds);
          }

          setFilledAreas(buildSelected);
        }
        setPoints(null);
      } else if (buildSelected.locationType === LocationType.Point) {
        if (buildSelected.parentLocation.locationType === LocationType.Quiz) {
          const lng = buildSelected.point.coordinates[0];
          const lat = buildSelected.point.coordinates[1];
          const diff = 0.1;

          const north = lat + diff;
          const east = lng + diff;
          const south = lat - diff;
          const west = lng - diff;

          setEmptyAreas(null);
          setBounds({ north, east, south, west });
        } else {
          setEmptyAreas(buildSelected.parentLocation);
          setBounds(buildSelected.parentLocation.displayBounds);
        }

        setFilledAreas(null);
        setPoints(buildSelected);
      }
    } else {
      setEmptyAreas(null);
      setFilledAreas(null);
      setPoints(null);
    }
  }, [buildSelected]);

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
