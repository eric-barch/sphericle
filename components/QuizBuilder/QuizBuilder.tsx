import Map from "@/components/Map";
import SplitPane from "@/components/SplitPane";
import { AreaState, LocationType, PointState, TreeState } from "@/types";
import { useContext, useEffect, useState } from "react";
import { Locations } from "./Locations";

export default function QuizBuilder() {
  const [placesLoaded, setPlacesLoaded] = useState<boolean>(false);
  const [locationTree, setLocationTree] = useState<TreeState>({
    locationType: LocationType.Tree,
    displayName: "Root",
    sublocations: [],
  });
  const [displayedLocation, setDisplayedLocation] = useState<
    AreaState | PointState | null
  >(null);

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
    searchLocation: TreeState | AreaState | PointState,
    targetLocation: TreeState | AreaState | PointState,
    newLocation: TreeState | AreaState | PointState | null,
  ): TreeState | AreaState | PointState | null {
    if (searchLocation === targetLocation) {
      return newLocation;
    }

    if (searchLocation.locationType === LocationType.Point) {
      return searchLocation;
    }

    if (
      searchLocation.locationType === LocationType.Tree ||
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
    targetLocation: TreeState | AreaState | PointState,
    newLocation: TreeState | AreaState | PointState | null,
  ): void {
    const newRoot = findLocation(locationTree, targetLocation, newLocation);

    if (newRoot?.locationType !== LocationType.Tree) {
      throw new Error("newRoot is not a RootState.");
    }

    setLocationTree(newRoot);
  }

  function addLocation(
    parentLocation: TreeState | AreaState,
    location: AreaState | PointState,
  ): void {
    const newParentLocation = {
      ...parentLocation,
      sublocations: [...parentLocation.sublocations, location],
    };

    setDisplayedLocation(location);
    replaceLocation(parentLocation, newParentLocation);
  }

  function toggleLocationOpen(targetLocation: AreaState): void {
    const newOpen = !targetLocation.open;

    console.log(newOpen);

    const newLocation = {
      ...targetLocation,
      open: newOpen,
    };

    setDisplayedLocation(newLocation);
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
            className="p-3 overflow-auto custom-scrollbar"
            style={{ maxHeight: "calc(100vh - 48px)" }}
            parentLocation={locationTree}
            addLocation={addLocation}
            toggleLocationOpen={toggleLocationOpen}
            deleteLocation={deleteLocation}
            setDisplayedLocation={setDisplayedLocation}
          />
          <Map mapId="696d0ea42431a75c" displayedLocation={displayedLocation} />
        </SplitPane>
      ) : (
        "Loading..."
      )}
    </>
  );
}
