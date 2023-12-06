import {
  AreaState,
  LocationType,
  MapItems,
  PointState,
  QuizState,
} from "@/types";

export function getQuizBuilderLocationMapItems(
  location: QuizState | AreaState | PointState | null,
): MapItems {
  if (!location || location.locationType === LocationType.Quiz) {
    return {
      emptyAreas: null,
      filledAreas: null,
      points: null,
    };
  }

  if (location.locationType === LocationType.Area) {
    if (location.isOpen) {
      return {
        bounds: location.displayBounds,
        emptyAreas: location,
        filledAreas: null,
        points: null,
      };
    } else if (!location.isOpen) {
      if (location.parent.locationType === LocationType.Quiz) {
        return {
          bounds: location.displayBounds,
          emptyAreas: null,
          filledAreas: location,
          points: null,
        };
      } else if (location.parent.locationType === LocationType.Area) {
        return {
          bounds: location.parent.displayBounds,
          emptyAreas: location.parent,
          filledAreas: location,
          points: null,
        };
      }
    }
  } else if (location.locationType === LocationType.Point) {
    if (location.parent.locationType === LocationType.Quiz) {
      const lng = location.point.coordinates[0];
      const lat = location.point.coordinates[1];
      const diff = 0.1;

      const north = lat + diff;
      const east = lng + diff;
      const south = lat - diff;
      const west = lng - diff;

      return {
        bounds: { north, east, south, west },
        emptyAreas: null,
        filledAreas: null,
        points: location,
      };
    } else if (location.parent.locationType === LocationType.Area) {
      return {
        bounds: location.parent.displayBounds,
        emptyAreas: location.parent,
        filledAreas: null,
        points: location,
      };
    }
  }
}
