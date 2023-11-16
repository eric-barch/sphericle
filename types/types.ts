import { LocationType } from "./enums";

export interface AreaState {
  parent: TreeState | AreaState;
  locationType: LocationType.Area;
  placeId: number;
  displayName: string;
  fullName: string;
  open: boolean;
  polygons: Polygon[];
  bounds: Bounds;
  sublocations: (AreaState | PointState)[];
}

export type Bounds = google.maps.LatLngBoundsLiteral;

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface PointState {
  parent: TreeState | AreaState;
  locationType: LocationType.Point;
  placeId: string;
  displayName: string;
  fullName: string;
  coordinate: Coordinate;
}

export interface Polygon {
  id: string;
  coordinates: Coordinate[];
}

export interface TreeState {
  locationType: LocationType.Tree;
  displayName: string;
  sublocations: (AreaState | PointState)[];
}
