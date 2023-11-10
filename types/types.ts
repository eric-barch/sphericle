import { LocationType } from "./enums";

export interface Area {
  locationType: LocationType.Area;
  placeId: number;
  fullName: string;
  displayName: string;
  isQuizQuestion: boolean;
  isOpen: boolean;
  componentPolygons: Polygon[];
  subLocationStates: (Area | Point)[];
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Point {
  locationType: LocationType.Point;
  placeId: string;
  fullName: string;
  displayName: string;
  position: Coordinate;
}

export interface Polygon {
  id: string;
  coordinates: Coordinate[];
}
