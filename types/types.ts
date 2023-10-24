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

export interface AreaOptions {
  searchTerm: string;
  options: Area[] | null;
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export type GooglePlacesSuggestion = google.maps.places.AutocompletePrediction;

export interface GooglePlacesSuggestionWithPosition
  extends GooglePlacesSuggestion {
  position: {
    lat: number;
    lng: number;
  };
}

export enum LocationType {
  Tree = "Tree",
  Area = "Area",
  Point = "Point",
}

export interface OpenStreetMapSuggestion {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: number[];
  geojson: {
    type: string;
    coordinates: any[];
  };
}

export interface Point {
  locationType: LocationType.Point;
  placeId: string;
  fullName: string;
  displayName: string;
  position: Coordinate;
}

export interface PointOptions {
  searchTerm: string;
  options: Point[] | null;
}

export interface Polygon {
  id: string;
  coordinates: Coordinate[];
}
