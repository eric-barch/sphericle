import { LocationType, AreaState, PointState, RootState } from "@/types";
import { useEffect, useState } from "react";
import { Locations } from "./Locations";
import SplitPane from "../SplitPane";

export default function QuizBuilder() {
  const [placesLoaded, setPlacesLoaded] = useState<boolean>(false);
  const [root, setRoot] = useState<RootState>({
    locationType: LocationType.Root,
    displayName: "Root",
    sublocations: [],
  });

  // TODO: is this a janky way to load Places?
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
    searchLocation: RootState | AreaState | PointState,
    targetLocation: RootState | AreaState | PointState,
    newLocation: RootState | AreaState | PointState | null,
  ): RootState | AreaState | PointState | null {
    if (searchLocation === targetLocation) {
      return newLocation;
    }

    if (searchLocation.locationType === LocationType.Point) {
      return searchLocation;
    }

    if (
      searchLocation.locationType === LocationType.Root ||
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
    targetLocation: RootState | AreaState | PointState,
    newLocation: RootState | AreaState | PointState | null,
  ): void {
    const newRoot = findLocation(root, targetLocation, newLocation);

    if (newRoot?.locationType !== LocationType.Root) {
      throw new Error("newRoot is not a RootState.");
    }

    setRoot(newRoot);
  }

  function addLocation(
    parentLocation: RootState | AreaState,
    childLocation: AreaState | PointState,
  ): void {
    const newParentLocation = {
      ...parentLocation,
      sublocations: [...parentLocation.sublocations, childLocation],
    };

    replaceLocation(parentLocation, newParentLocation);
  }

  function toggleLocationOpen(targetLocation: AreaState): void {
    const newLocation = {
      ...targetLocation,
      open: !targetLocation.open,
    };

    replaceLocation(targetLocation, newLocation);
  }

  function deleteLocation(targetLocation: AreaState | PointState): void {
    replaceLocation(targetLocation, null);
  }

  useEffect(() => {
    console.log(root);
  }, [root]);

  return (
    <SplitPane>
      <>
        {placesLoaded ? (
          <Locations
            parentLocation={root}
            addLocation={addLocation}
            toggleLocationOpen={toggleLocationOpen}
            deleteLocation={deleteLocation}
          />
        ) : (
          "Loading..."
        )}
      </>
      <div className="bg-red-900 h-full w-full" />
      <div className="bg-blue-900 h-full w-full" />
      <div className="bg-green-900 h-full w-full" />
    </SplitPane>
  );
}
