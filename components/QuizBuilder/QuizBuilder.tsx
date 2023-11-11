import { LocationType, AreaState, PointState, RootState } from "@/types";
import { useEffect, useState } from "react";
import { Locations } from "./Locations";

export default function QuizBuilder() {
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

  const [placesLoaded, setPlacesLoaded] = useState<boolean>(false);
  const [rootState, setRootState] = useState<RootState>({
    locationType: LocationType.Root,
    displayName: "Root",
    sublocations: [],
  });

  function findAndReplaceLocation(
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
        const newSublocation = findAndReplaceLocation(
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

  function replaceLocationState(
    targetLocationState: AreaState | PointState,
    newLocationState: AreaState | PointState,
  ): void {
    const newRootState = findAndReplaceLocation(
      rootState,
      targetLocationState,
      newLocationState,
    );

    if (newRootState?.locationType !== LocationType.Root) {
      throw new Error("newRootState is not a RootState.");
    }

    setRootState(newRootState);
  }

  return (
    <div className="m-3">
      {placesLoaded ? (
        <Locations
          parentLocationType={LocationType.Root}
          parentLocationDisplayName={LocationType.Root}
          locations={rootState.sublocations}
        />
      ) : (
        "Loading..."
      )}
    </div>
  );
}
