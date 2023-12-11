"use client";

import Map from "@/components/Map";
import { rootId, useQuiz } from "@/components/QuizProvider";
import SplitPane from "@/components/SplitPane";
import { navHeight } from "@/constants";
import { AreaState, LocationType, PointState } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import Sublocations from "./Sublocations";

export default function QuizBuilder() {
  const quiz = useQuiz();

  const [mapId, setMapId] = useState<string>("696d0ea42431a75c");
  const [bounds, setBounds] = useState<google.maps.LatLngBoundsLiteral>({
    // TODO: for now, default to NYC bounds
    east: -73.70018,
    north: 40.916178,
    south: 40.495992,
    west: -74.25909,
  });
  const [emptyAreas, setEmptyAreas] = useState<AreaState | null>(null);
  const [filledAreas, setFilledAreas] = useState<AreaState | null>(null);
  const [markedPoints, setMarkedPoints] = useState<PointState | null>(null);

  useEffect(() => {
    const location = quiz.locations[quiz.builderSelectedId];

    if (!location) {
      setEmptyAreas(null);
      setFilledAreas(null);
      setMarkedPoints(null);
      return;
    }

    if (
      location.locationType !== LocationType.AREA &&
      location.locationType !== LocationType.POINT
    ) {
      throw new Error("location must be of type AREA or POINT.");
    }

    const parentLocation = quiz.locations[location.parentId];

    if (parentLocation.locationType === LocationType.ROOT) {
      if (location.locationType === LocationType.AREA) {
        setBounds(location.displayBounds);

        if (location.isOpen) {
          setEmptyAreas(location);
          setFilledAreas(null);
          setMarkedPoints(null);
        } else if (!location.isOpen) {
          setEmptyAreas(null);
          setFilledAreas(location);
          setMarkedPoints(null);
        }
      } else if (location.locationType === LocationType.POINT) {
        setBounds(location.displayBounds);
        setEmptyAreas(null);
        setFilledAreas(null);
        setMarkedPoints(location);
      }
    } else if (parentLocation.locationType === LocationType.AREA) {
      if (location.locationType === LocationType.AREA) {
        if (location.isOpen) {
          setBounds(location.displayBounds);
          setEmptyAreas(location);
          setFilledAreas(null);
          setMarkedPoints(null);
        } else if (!location.isOpen) {
          setBounds(parentLocation.displayBounds);
          setEmptyAreas(parentLocation);
          setFilledAreas(location);
          setMarkedPoints(null);
        }
      } else if (location.locationType === LocationType.POINT) {
        setBounds(parentLocation.displayBounds);
        setEmptyAreas(parentLocation);
        setFilledAreas(null);
        setMarkedPoints(location);
      }
    }
  }, [quiz]);

  return (
    <SplitPane>
      <div className="relative h-full">
        <Sublocations
          className={`p-3 overflow-auto custom-scrollbar max-h-[calc(100vh-3rem)]`}
          parentId={rootId}
        />
        <Link
          className="absolute bottom-0 right-0 rounded-2xl px-3 py-2 bg-green-700 m-3"
          href="/take-quiz"
        >
          Take Quiz
        </Link>
      </div>
      <Map
        mapId={mapId}
        bounds={bounds}
        emptyAreas={emptyAreas}
        filledAreas={filledAreas}
        markedPoints={markedPoints}
      />
    </SplitPane>
  );
}
