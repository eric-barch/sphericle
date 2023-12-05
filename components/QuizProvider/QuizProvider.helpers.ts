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
  currentLocation: Quiz | AreaState | PointState,
  targetId: string,
  newLocation: Quiz | AreaState | PointState,
  newParent?: Quiz | AreaState,
) {
  if (currentLocation.id === targetId) {
    return { ...newLocation, parent: newParent };
  }

  if (currentLocation.locationType === LocationType.Quiz) {
    if (currentLocation.sublocations.length <= 0) {
      return { ...currentLocation };
    }

    if (currentLocation.sublocations.length > 0) {
      const newCurrentLocation = { ...currentLocation };

      const newSublocations: (AreaState | PointState)[] = [];

      for (const sublocation of currentLocation.sublocations) {
        const newSublocation = replaceLocation(
          sublocation,
          targetId,
          newLocation,
          newCurrentLocation,
        );

        if (
          newSublocation.locationType !== LocationType.Area &&
          newSublocation.locationType !== LocationType.Point
        ) {
          continue;
        }

        newSublocations.push(newSublocation);
      }

      newCurrentLocation.sublocations = newSublocations;

      return newCurrentLocation;
    }
  }

  if (currentLocation.locationType === LocationType.Area) {
    if (currentLocation.sublocations.length <= 0) {
      return { ...currentLocation, parent: newParent };
    }

    if (currentLocation.sublocations.length > 0) {
      const newCurrentLocation = { ...currentLocation, parent: newParent };

      const newSublocations: (AreaState | PointState)[] = [];

      for (const sublocation of currentLocation.sublocations) {
        const newSublocation = replaceLocation(
          sublocation,
          targetId,
          newLocation,
          newCurrentLocation,
        );

        if (
          newSublocation.locationType !== LocationType.Area &&
          newSublocation.locationType !== LocationType.Point
        ) {
          continue;
        }

        newSublocations.push(newSublocation);
      }

      newCurrentLocation.sublocations = newSublocations;

      return newCurrentLocation;
    }
  }

  if (currentLocation.locationType === LocationType.Point) {
    return { ...currentLocation, parent: newParent };
  }
}
