"use client";

import { ChildFeatures } from "@/components/build-quiz/child-features";
import { Polygon } from "@/components/map";
import { DEFAULT_BOUNDS, RESTRICTION } from "@/components/map/constants";
import { SplitPane } from "@/components/split-pane";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isArea, isChild, isParent, isPoint, isRoot } from "@/helpers";
import { useAllFeatures, useQuizBuilder } from "@/providers";
import { Map, Marker, useMap } from "@vis.gl/react-google-maps";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const BuildQuiz = () => {
  const { rootId, allFeatures } = useAllFeatures();
  const { quizBuilder } = useQuizBuilder();
  const map = useMap();

  const root = (() => {
    const root = allFeatures.get(rootId);
    if (isRoot(root)) return root;
  })();

  const rootIsAdding = rootId === quizBuilder.addingId;

  const displayed = (() => {
    if (quizBuilder.searchResult) return quizBuilder.searchResult;
    const selected = allFeatures.get(quizBuilder.selectedId);
    if (isChild(selected)) return selected;
  })();

  const displayedParent = (() => {
    if (!isChild(displayed)) return;
    const displayedParent = allFeatures.get(displayed.parentId);
    if (isParent(displayedParent)) return displayedParent;
  })();

  const displayedIsOpen = quizBuilder.openIds.has(displayed?.id);

  const [tilesLoaded, setTilesLoaded] = useState(false);
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    /**Must check if map is idle before fitting bounds. */
    if (!isIdle) return;

    let bounds: google.maps.LatLngBoundsLiteral;

    if (isArea(displayed)) {
      if (displayedIsOpen) bounds = displayed.displayBounds;

      if (!displayedIsOpen) {
        if (isArea(displayedParent)) bounds = displayedParent.displayBounds;
        if (isRoot(displayedParent)) bounds = displayed.displayBounds;
      }
    }

    if (isPoint(displayed)) {
      if (isArea(displayedParent)) bounds = displayedParent.displayBounds;
      if (isRoot(displayedParent)) bounds = displayed.displayBounds;
    }

    if (bounds) {
      map?.fitBounds(bounds);
    }
  }, [displayed, displayedIsOpen, displayedParent, isIdle, map]);

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
            isAdding={rootIsAdding}
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
          onBoundsChanged={() => setIsIdle(false)}
          onIdle={() => setIsIdle(true)}
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
