import { AreaState, LocationType, MapItems, PointState, Quiz } from "@/types";

export function getLocationMapItems(
  location: Quiz | AreaState | PointState | null,
): MapItems {
  if (location && location.locationType !== LocationType.Quiz) {
    if (location.locationType === LocationType.Area) {
      if (location.isOpen) {
        return {
          emptyAreas: location,
          filledAreas: null,
          bounds: location.displayBounds,
          points: null,
        };
      } else {
        let emptyAreas = null;
        let bounds = null;

        if (location.parent.locationType === LocationType.Quiz) {
          emptyAreas = null;
          bounds = location.displayBounds;
        } else if (location.parent.locationType === LocationType.Area) {
          emptyAreas = location.parent;
          bounds = location.parent.displayBounds;
        }

        return {
          emptyAreas,
          filledAreas: location,
          bounds,
          points: null,
        };
      }
    } else if (location.locationType === LocationType.Point) {
      let emptyAreas = null;
      let bounds = null;

      if (location.parent.locationType === LocationType.Quiz) {
        const lng = location.point.coordinates[0];
        const lat = location.point.coordinates[1];
        const diff = 0.1;

        const north = lat + diff;
        const east = lng + diff;
        const south = lat - diff;
        const west = lng - diff;

        emptyAreas = null;
        bounds = { north, east, south, west };
      } else {
        emptyAreas = location.parent;
        bounds = location.parent.displayBounds;
      }

      return {
        emptyAreas,
        filledAreas: null,
        bounds,
        points: location,
      };
    }
  } else {
    return {
      emptyAreas: null,
      filledAreas: null,
      points: null,
    };
  }
}
