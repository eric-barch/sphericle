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

export enum LocationType {
  Tree = "Tree",
  Area = "Area",
  Point = "Point",
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

export enum SearchStatus {
  Searching = "Searching",
  Searched = "Searched",
}
