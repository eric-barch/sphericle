import { AreaState, LocationType, MapItems, PointState, Quiz } from "@/types";

export function getQuizTakerLocationMapItems(
  parent: Quiz | AreaState,
  location: Quiz | AreaState | PointState | null,
): MapItems {
  if (location && location.locationType !== LocationType.Quiz) {
    if (location.locationType === LocationType.Area) {
      if (parent.locationType === LocationType.Area) {
        return {
          bounds: parent.displayBounds,
          emptyAreas: parent,
          filledAreas: location,
          points: null,
        };
      } else if (parent.locationType === LocationType.Quiz) {
        return {
          bounds: location.displayBounds,
          emptyAreas: null,
          filledAreas: location,
          points: null,
        };
      }
    } else if (location.locationType === LocationType.Point) {
      if (parent.locationType === LocationType.Area) {
        return {
          bounds: parent.displayBounds,
          emptyAreas: parent,
          filledAreas: null,
          points: location,
        };
      } else if (parent.locationType === LocationType.Quiz) {
        const lng = location.point.coordinates[0];
        const lat = location.point.coordinates[1];
        const diff = 0.1;

        const north = lat + diff;
        const east = lng + diff;
        const south = lat - diff;
        const west = lng - diff;

        const bounds = { north, east, south, west };

        return {
          bounds,
          emptyAreas: null,
          filledAreas: null,
          points: location,
        };
      }
    }
  } else {
    return {
      emptyAreas: null,
      filledAreas: null,
      points: null,
    };
  }
}
