"use client";

import { ChildFeatures } from "@/components/build-quiz/child-features";
import { Polygon } from "@/components/map";
import { DEFAULT_BOUNDS, RESTRICTION } from "@/components/map/constants";
import { SplitPane } from "@/components/split-pane";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isArea, isChild, isParent, isPoint, isEarth } from "@/helpers";
import { useQuiz, useQuizBuilder } from "@/providers";
import { Map, Marker, useMap } from "@vis.gl/react-google-maps";
import Link from "next/link";
import { useEffect, useState } from "react";

const BuildQuiz = () => {
  const { earthId, quiz } = useQuiz();
  const { quizBuilder } = useQuizBuilder();
  const map = useMap();

  const root = (() => {
    const root = quiz.get(earthId);
    if (isEarth(root)) return root;
  })();

  const isAdding = earthId === quizBuilder.addingId;

  const displayed = (() => {
    if (quizBuilder.searchResult) return quizBuilder.searchResult;
    const selected = quiz.get(quizBuilder.selectedId);
    if (isChild(selected)) return selected;
  })();

  const displayedIsOpen = quizBuilder.openIds.has(displayed?.id);

  const displayedParent = (() => {
    if (!isChild(displayed)) return;
    const displayedParent = quiz.get(displayed.parentId);
    if (isParent(displayedParent)) return displayedParent;
  })();

  const [tilesLoaded, setTilesLoaded] = useState(false);

  /**TODO: fitBounds cancels early sometimes. Seems to be only on the first
   * call if the zoom is large enough to cause the map to "cut" rather
   * than animate the zoom smoothly. */
  useEffect(() => {
    let bounds: google.maps.LatLngBoundsLiteral;

    if (displayedIsOpen) {
      bounds = displayed?.displayBounds;
    } else {
      if (isArea(displayedParent)) {
        bounds = displayedParent.displayBounds;
      }

      if (isEarth(displayedParent)) {
        bounds = displayed?.displayBounds;
      }
    }

    if (bounds) {
      map?.fitBounds(bounds);
    }
  }, [displayed, displayedIsOpen, displayedParent, map, tilesLoaded]);

  return (
    <>
      {!tilesLoaded && (
        <LoadingSpinner className="absolute left-0 right-0 top-0 z-40 bg-gray-700" />
      )}
      <SplitPane>
        <div className="relative h-full">
          <ChildFeatures
            className={`p-3 overflow-auto custom-scrollbar max-h-[calc(100vh-4rem)]`}
            parent={root}
            isAdding={isAdding}
          />
          <Link
            className="absolute bottom-0 right-0 rounded-3xl px-3 py-2 bg-green-700 m-3"
            href="/take-quiz"
          >
            Take Quiz
          </Link>
        </div>
        <Map
          className="h-full w-full outline-none border-none"
          mapId="696d0ea42431a75c"
          gestureHandling="greedy"
          disableDefaultUI
          restriction={RESTRICTION}
          defaultBounds={displayed?.displayBounds || DEFAULT_BOUNDS}
          onTilesLoaded={() => setTilesLoaded(true)}
        >
          {!displayedIsOpen && isArea(displayedParent) && (
            <Polygon
              polygon={displayedParent.polygon}
              strokeWeight={1.5}
              strokeColor="#b91c1c"
              fillOpacity={0}
            />
          )}
          {isArea(displayed) && (
            <Polygon
              polygon={displayed.polygon}
              strokeWeight={1.5}
              strokeColor="#b91c1c"
              fillColor="#b91c1c"
              fillOpacity={displayedIsOpen ? 0 : 0.2}
            />
          )}
          {isPoint(displayed) && (
            <Marker
              position={{
                lng: displayed.point.coordinates[0],
                lat: displayed.point.coordinates[1],
              }}
            />
          )}
        </Map>
      </SplitPane>
    </>
  );
};

export default BuildQuiz;
