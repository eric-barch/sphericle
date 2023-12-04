import { AreaState, LocationType, PointState, Quiz } from "@/types";
import _ from "lodash";

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
  quiz: Quiz,
  targetId: string,
  newLocation: Quiz | AreaState | PointState | null,
): Quiz {
  const newQuiz = findAndReplaceLocation(quiz, targetId, newLocation);

  if (newQuiz?.locationType !== LocationType.Quiz) {
    throw new Error("newQuiz is not a Quiz.");
  }

  return _.cloneDeep(newQuiz);
}

function findAndReplaceLocation(
  searchLocation: Quiz | AreaState | PointState,
  targetId: string,
  newLocation: Quiz | AreaState | PointState | null,
): Quiz | AreaState | PointState | null {
  const clonedSearchLocation = _.cloneDeep(searchLocation);

  if (clonedSearchLocation.id === targetId) {
    return _.cloneDeep(newLocation);
  }

  if (clonedSearchLocation.locationType === LocationType.Point) {
    return clonedSearchLocation;
  }

  if (
    clonedSearchLocation.locationType === LocationType.Quiz ||
    clonedSearchLocation.locationType === LocationType.Area
  ) {
    let newSublocations: (AreaState | PointState)[] = [];

    for (const currentSublocation of clonedSearchLocation.sublocations) {
      const newSublocation = findAndReplaceLocation(
        currentSublocation,
        targetId,
        newLocation,
      );

      if (newSublocation && newSublocation.locationType !== LocationType.Quiz) {
        newSublocations.push(newSublocation);
      }
    }

    return {
      ...clonedSearchLocation,
      sublocations: newSublocations,
    };
  }

  return null;
}
