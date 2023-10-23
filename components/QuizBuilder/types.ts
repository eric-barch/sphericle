// TODO: don't love having a Tree location type. should just be area and point.

export enum LocationType {
  Tree = "Tree",
  Area = "Area",
  Point = "Point",
}

export interface OsmResponseItem {
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

export type AutocompletePrediction = google.maps.places.AutocompletePrediction;

export interface Prediction extends AutocompletePrediction {
  position: { lat: number; lng: number };
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Polygon {
  // need id for mapping?
  id: string;
  coordinates: Coordinate[];
}

export interface AreaState {
  locationType: LocationType.Area;
  placeId: number;
  fullName: string;
  displayName: string;
  isQuizQuestion: boolean;
  isOpen: boolean;
  subLocationStates: (AreaState | PointState)[];
  componentPolygons: Polygon[];
}

export interface PointState {
  locationType: LocationType.Point;
  placeId: string;
  displayName: string;
  fullName: string;
  position: Coordinate;
}

export interface PointOptionsState {
  searchTerm: string;
  options: PointState[] | null;
}

export interface AreaOptionsState {
  searchTerm: string;
  options: AreaState[] | null;
}
