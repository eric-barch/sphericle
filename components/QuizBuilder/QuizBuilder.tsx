import Map from "@/components/Map";
import SplitPane from "@/components/SplitPane";
import { AreaState, LocationType, PointState, QuizState } from "@/types";
import { useEffect, useState } from "react";
import { Locations } from "./Locations";

export default function QuizBuilder() {
  const [placesLoaded, setPlacesLoaded] = useState<boolean>(false);
  const [quiz, setQuiz] = useState<QuizState>({
    locationType: LocationType.Quiz,
    displayName: "Root",
    sublocations: [],
  });
  const [bounds, setBounds] = useState<google.maps.LatLngBoundsLiteral | null>(
    null,
  );
  const [filledAreas, setFilledAreas] = useState<AreaState[] | null>(null);
  const [emptyAreas, setEmptyAreas] = useState<AreaState[] | null>(null);
  const [markers, setMarkers] = useState<PointState[] | null>(null);

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

  function findLocation(
    searchLocation: QuizState | AreaState | PointState,
    targetLocation: QuizState | AreaState | PointState,
    newLocation: QuizState | AreaState | PointState | null,
  ): QuizState | AreaState | PointState | null {
    if (searchLocation === targetLocation) {
      return newLocation;
    }

    if (searchLocation.locationType === LocationType.Point) {
      return searchLocation;
    }

    if (
      searchLocation.locationType === LocationType.Quiz ||
      searchLocation.locationType === LocationType.Area
    ) {
      let newSublocations: (AreaState | PointState)[] = [];

      for (const currentSublocation of searchLocation.sublocations) {
        const newSublocation = findLocation(
          currentSublocation,
          targetLocation,
          newLocation,
        );

        if (
          newSublocation?.locationType === LocationType.Area ||
          newSublocation?.locationType === LocationType.Point
        ) {
          newSublocations.push(newSublocation);
        }
      }

      const newSearchLocation = {
        ...searchLocation,
        sublocations: newSublocations,
      };

      return newSearchLocation;
    }

    throw new Error(
      "Could not classify searchLocation as Root, Area, or Point.",
    );
  }

  function replaceLocation(
    targetLocation: QuizState | AreaState | PointState,
    newLocation: QuizState | AreaState | PointState | null,
  ): void {
    const newQuiz = findLocation(quiz, targetLocation, newLocation);

    if (newQuiz?.locationType !== LocationType.Quiz) {
      throw new Error("newRoot is not a RootState.");
    }

    setQuiz(newQuiz);
  }

  function setFocusedLocation(location: AreaState | PointState | null) {
    if (location) {
      if (location.locationType === LocationType.Area) {
        if (location.open) {
          setEmptyAreas([location]);
          setFilledAreas(null);
          setBounds(location.displayBounds);
        } else {
          if (location.parent.locationType === LocationType.Quiz) {
            setEmptyAreas(null);
            setBounds(location.displayBounds);
          } else if (location.parent.locationType === LocationType.Area) {
            setEmptyAreas([location.parent]);
            setBounds(location.parent.displayBounds);
          }

          setFilledAreas([location]);
        }
        setMarkers(null);
      } else if (location.locationType === LocationType.Point) {
        if (location.parent.locationType === LocationType.Quiz) {
          const lng = location.point.coordinates[0];
          const lat = location.point.coordinates[1];
          const diff = 0.1;

          const north = lat + diff;
          const east = lng + diff;
          const south = lat - diff;
          const west = lng - diff;

          setEmptyAreas(null);
          setBounds({ north, east, south, west });
        } else {
          setEmptyAreas([location.parent]);
          setBounds(location.parent.displayBounds);
        }

        setFilledAreas(null);
        setMarkers([location]);
      }
    } else {
      setEmptyAreas(null);
      setFilledAreas(null);
      setMarkers(null);
    }
  }

  function addLocation(
    parentLocation: QuizState | AreaState,
    location: AreaState | PointState,
  ): void {
    const newParentLocation = {
      ...parentLocation,
      sublocations: [...parentLocation.sublocations, location],
    };

    setFocusedLocation(location);
    replaceLocation(parentLocation, newParentLocation);
  }

  function toggleLocationOpen(targetLocation: AreaState): void {
    const newOpen = !targetLocation.open;

    console.log(newOpen);

    const newLocation = {
      ...targetLocation,
      open: newOpen,
    };

    setFocusedLocation(newLocation);
    replaceLocation(targetLocation, newLocation);
  }

  function deleteLocation(targetLocation: AreaState | PointState): void {
    replaceLocation(targetLocation, null);
  }

  return (
    <>
      {placesLoaded ? (
        <SplitPane>
          <Locations
            className={`p-3 overflow-auto custom-scrollbar max-h-[calc(100vh-48px)]`}
            parent={quiz}
            addLocation={addLocation}
            toggleLocationOpen={toggleLocationOpen}
            deleteLocation={deleteLocation}
            setFocusedLocation={setFocusedLocation}
          />
          <Map
            mapId="696d0ea42431a75c"
            bounds={bounds}
            filledAreas={filledAreas}
            emptyAreas={emptyAreas}
            markers={markers}
          />
        </SplitPane>
      ) : (
        "Loading..."
      )}
    </>
  );
}
