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

export interface AreaSearchResults {
  searchTerm: string;
  searchResults: Area[] | null;
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

export interface PointSearchResults {
  searchTerm: string;
  searchResults: Point[] | null;
}

export interface Polygon {
  id: string;
  coordinates: Coordinate[];
}
