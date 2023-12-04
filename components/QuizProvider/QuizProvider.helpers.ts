import { AreaState, LocationType, PointState, Quiz } from "@/types";

export function findLocation(
  searchLocation: Quiz | AreaState | PointState,
  locationId: string,
): AreaState | PointState | null {
  if (searchLocation.id === locationId) {
    if (searchLocation.locationType === LocationType.Quiz) {
      return null;
    }

    return searchLocation;
  }

  if (searchLocation.locationType === LocationType.Point) {
    return null;
  }

  if (
    searchLocation.locationType === LocationType.Quiz ||
    searchLocation.locationType === LocationType.Area
  ) {
    for (const currentSublocation of searchLocation.sublocations) {
      const foundLocation = findLocation(currentSublocation, locationId);

      if (foundLocation) {
        return foundLocation;
      }
    }
  }

  return null;
}

export function replaceLocation(
  searchLocation: Quiz | AreaState | PointState,
  targetLocationId: string,
  newLocation: Quiz | AreaState | PointState | null,
  parent: Quiz | AreaState | null,
): Quiz | AreaState | PointState | null {
  if (searchLocation.id === targetLocationId) {
    let clonedNewLocation: Quiz | AreaState | PointState = {
      ...newLocation,
    };

    if ("parent" in clonedNewLocation) {
      clonedNewLocation.parent = parent;
    }

    if (
      "sublocations" in clonedNewLocation &&
      "sublocations" in searchLocation
    ) {
      const newSublocations = [];

      for (const sublocation of searchLocation.sublocations) {
        const newSublocation = replaceLocation(
          sublocation,
          targetLocationId,
          newLocation,
          clonedNewLocation,
        );

        if ("parent" in newSublocation) {
          newSublocations.push(newSublocation);
        }
      }

      clonedNewLocation.sublocations = newSublocations;
    }

    return clonedNewLocation;
  }

  if ("sublocations" in searchLocation) {
    const newSublocations = [];

    for (const sublocation of searchLocation.sublocations) {
      const newSublocation = replaceLocation(
        sublocation,
        targetLocationId,
        newLocation,
        searchLocation,
      );

      if ("parent" in newSublocation) {
        newSublocations.push(newSublocation);
      }
    }

    searchLocation.sublocations = newSublocations;
  }

  return searchLocation;
}
