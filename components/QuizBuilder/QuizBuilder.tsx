import Map from "@/components/Map";
import SplitPane from "@/components/SplitPane";
import { AreaState, LocationType, PointState, QuizState } from "@/types";
import { useEffect, useState } from "react";
import { Sublocations } from "./Sublocations";

export default function QuizBuilder() {
  const [placesLoaded, setPlacesLoaded] = useState<boolean>(false);
  const [quiz, setQuiz] = useState<QuizState>({
    locationType: LocationType.Quiz,
    sublocations: [],
  });
  const [bounds, setBounds] = useState<google.maps.LatLngBoundsLiteral | null>(
    null,
  );
  const [filledAreas, setFilledAreas] = useState<AreaState[] | null>(null);
  const [markers, setMarkers] = useState<PointState[] | null>(null);
  const [emptyAreas, setEmptyAreas] = useState<AreaState[] | null>(null);

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

  function setDisplayedLocation(location: AreaState | PointState | null) {
    if (location) {
      if (location.locationType === LocationType.Area) {
        if (location.open) {
          setEmptyAreas([location]);
          setFilledAreas(null);
          setBounds(location.displayBounds);
        } else {
          if (location.parentLocation.locationType === LocationType.Quiz) {
            setEmptyAreas(null);
            setBounds(location.displayBounds);
          } else if (
            location.parentLocation.locationType === LocationType.Area
          ) {
            setEmptyAreas([location.parentLocation]);
            setBounds(location.parentLocation.displayBounds);
          }

          setFilledAreas([location]);
        }
        setMarkers(null);
      } else if (location.locationType === LocationType.Point) {
        if (location.parentLocation.locationType === LocationType.Quiz) {
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
          setEmptyAreas([location.parentLocation]);
          setBounds(location.parentLocation.displayBounds);
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

    setDisplayedLocation(location);
    replaceLocation(parentLocation, newParentLocation);
  }

  function deleteLocation(location: AreaState | PointState): void {
    replaceLocation(location, null);

    if (location.parentLocation.locationType === LocationType.Area) {
      setDisplayedLocation(location.parentLocation);
    } else {
      setDisplayedLocation(null);
    }
  }

  function renameLocation(location: AreaState | PointState, name: string) {
    const newLocation = { ...location, userDefinedName: name };
    replaceLocation(location, newLocation);
  }

  function toggleLocationOpen(location: AreaState): void {
    const newOpen = !location.open;

    const newLocation = {
      ...location,
      open: newOpen,
    };

    setDisplayedLocation(newLocation);
    replaceLocation(location, newLocation);
  }

  return (
    <>
      {placesLoaded ? (
        <SplitPane>
          <Sublocations
            className={`p-3 overflow-auto custom-scrollbar max-h-[calc(100vh-48px)]`}
            parentLocation={quiz}
            setParentOutlined={() => {}}
            addLocation={addLocation}
            deleteLocation={deleteLocation}
            renameLocation={renameLocation}
            toggleLocationOpen={toggleLocationOpen}
            setDisplayedLocation={setDisplayedLocation}
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
