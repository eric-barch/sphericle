"use client";

import Link from "next/link";
import SplitPane from "@/components/SplitPane";
import Map from "@/components/Map";
import { rootId } from "@/components/QuizProvider";
import Sublocations from "./Sublocations";

export default function QuizBuilder() {
  const mapId = "696d0ea42431a75c";
  // for now, default to NYC bounds
  const bounds: google.maps.LatLngBoundsLiteral = {
    east: -73.70018,
    north: 40.916178,
    south: 40.495992,
    west: -74.25909,
  };
  const emptyAreas = null;
  const filledAreas = null;
  const markedPoints = null;

  return (
    <SplitPane>
      <div className="relative h-full">
        <Sublocations
          className={`p-3 overflow-auto custom-scrollbar max-h-[calc(100vh-48px)]`}
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
        mapId={mapId}
        bounds={bounds}
        emptyAreas={emptyAreas}
        filledAreas={filledAreas}
        markedPoints={markedPoints}
      />
    </SplitPane>
  );
}
