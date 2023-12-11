"use client";

import Map from "@/components/Map";
import { useQuiz, useQuizDispatch } from "@/components/QuizProvider";
import { AreaState, LocationType, PointState, QuizDispatchType } from "@/types";
import { useEffect, useState } from "react";

export default function QuizTaker() {
  const quiz = useQuiz();
  const quizDispatch = useQuizDispatch();

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
    quizDispatch({
      type: QuizDispatchType.RESET_TAKER_SELECTED,
    });
  }, [quizDispatch, quiz.rootId]);

  useEffect(() => {
    const location = quiz.locations[quiz.selectedTakerLocationId];

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
        setBounds(location.bounds);

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
        setBounds(location.bounds);
        setEmptyAreas(null);
        setFilledAreas(null);
        setMarkedPoints(location);
      }
    } else if (parentLocation.locationType === LocationType.AREA) {
      if (location.locationType === LocationType.AREA) {
        if (location.isOpen) {
          setBounds(location.bounds);
          setEmptyAreas(location);
          setFilledAreas(null);
          setMarkedPoints(null);
        } else if (!location.isOpen) {
          setBounds(parentLocation.bounds);
          setEmptyAreas(parentLocation);
          setFilledAreas(location);
          setMarkedPoints(null);
        }
      } else if (location.locationType === LocationType.POINT) {
        setBounds(parentLocation.bounds);
        setEmptyAreas(parentLocation);
        setFilledAreas(null);
        setMarkedPoints(location);
      }
    }
  }, [quiz]);

  return (
    <div className="h-[calc(100vh-3rem)]">
      <Map
        mapId={mapId}
        bounds={bounds}
        emptyAreas={emptyAreas}
        filledAreas={filledAreas}
        markedPoints={markedPoints}
      />
    </div>
  );
}
