"use client";

import { ChildFeatures } from "@/components/build-quiz/child-features";
import { Polygon } from "@/components/map";
import { DEFAULT_BOUNDS, RESTRICTION } from "@/components/map/constants";
import { SplitPane } from "@/components/split-pane";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isArea, isChild, isEarth, isParent, isPoint } from "@/helpers";
import { useQuiz, useQuizBuilder } from "@/providers";
import { Map, Marker, useMap } from "@vis.gl/react-google-maps";
import Link from "next/link";
import { useEffect, useState } from "react";

const BuildQuiz = () => {
  const { earthId, quiz } = useQuiz();
  const { quizBuilder } = useQuizBuilder();
  const map = useMap();

  const earth = (() => {
    const earth = quiz.get(earthId);
    if (isEarth(earth)) return earth;
  })();

  const earthIsAdding = earthId === quizBuilder.addingId;

  const displayed = (() => {
    if (quizBuilder.searchOption) return quizBuilder.searchOption;
    const selected = quiz.get(quizBuilder.selectedId);
    if (isChild(selected)) return selected;
  })();

  const displayedIsOpen = quizBuilder.openIds.has(displayed?.id);

  const displayedParent = (() => {
    if (!isChild(displayed)) return;
    const displayedParent = quiz.get(displayed.parentId);
    if (isParent(displayedParent)) return displayedParent;
  })();

  const [tilesAreLoaded, setTilesAreLoaded] = useState(false);
  const [mapIsIdle, setMapIsIdle] = useState(false);
  const [mapIsLoaded, setMapIsLoaded] = useState(false);
  const [targetBounds, setTargetBounds] =
    useState<google.maps.LatLngBoundsLiteral>(DEFAULT_BOUNDS);

  const handleTilesLoaded = () => {
    setTilesAreLoaded(true);
  };

  const handleIdle = () => {
    setMapIsIdle(true);
  };

  const handleBoundsChanged = () => {
    setMapIsIdle(false);
    setTilesAreLoaded(false);
  };

  /**Set mapIsLoaded on first load. */
  useEffect(() => {
    if (mapIsIdle && tilesAreLoaded) {
      setMapIsLoaded(true);
    }
  }, [mapIsIdle, tilesAreLoaded]);

  /**Update targetBounds whenever displayed, displayedIsOpen, or displayedParent changes.*/
  useEffect(() => {
    let targetBounds: google.maps.LatLngBoundsLiteral;

    if (displayedIsOpen) {
      targetBounds = displayed?.displayBounds;
    } else {
      if (isArea(displayedParent)) {
        targetBounds = displayedParent.displayBounds;
      }

      if (isEarth(displayedParent)) {
        targetBounds = displayed?.displayBounds;
      }
    }

    if (!targetBounds) return;

    setTargetBounds(targetBounds);
  }, [displayed, displayedIsOpen, displayedParent]);

  /**Call fitBounds on the map ref when targetBounds change. */
  useEffect(() => {
    if (!map || !mapIsLoaded || !targetBounds) return;

    const lat = (targetBounds.north + targetBounds.south) / 2;
    const lng = (targetBounds.east + targetBounds.west) / 2;

    map.fitBounds(targetBounds);
    map.setCenter({ lat, lng });
  }, [map, mapIsLoaded, targetBounds]);

  return (
    <>
      {!mapIsLoaded && (
        <LoadingSpinner className="absolute left-0 right-0 top-0 z-40 bg-gray-700" />
      )}
      <SplitPane>
        <div className="relative h-full">
          <ChildFeatures
            className={`p-3 overflow-auto custom-scrollbar max-h-[calc(100vh-4rem)]`}
            parent={earth}
            isAdding={earthIsAdding}
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
          defaultBounds={targetBounds}
          onTilesLoaded={handleTilesLoaded}
          onIdle={handleIdle}
          onBoundsChanged={handleBoundsChanged}
        >
          {!displayedIsOpen && isArea(displayedParent) && (
            <Polygon
              geoJson={displayedParent.polygon}
              strokeWeight={1.5}
              strokeColor="#b91c1c"
              fillOpacity={0}
            />
          )}
          {isArea(displayed) && (
            <Polygon
              geoJson={displayed.polygon}
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
