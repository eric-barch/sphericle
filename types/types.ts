import { LocationType } from "./enums";

export interface AreaState {
  locationType: LocationType.Area;
  placeId: number;
  displayName: string;
  fullName: string;
  open: boolean;
  polygons: Polygon[];
  sublocations: (AreaState | PointState)[];
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface PointState {
  locationType: LocationType.Point;
  placeId: string;
  displayName: string;
  fullName: string;
  position: Coordinate;
}

export interface Polygon {
  id: string;
  coordinates: Coordinate[];
}
