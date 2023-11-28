import { AllGeoJSON } from "@turf/helpers";
import { MultiPolygon, Point, Polygon } from "geojson";
import { DispatchType, LocationType } from "./enums";

export interface AreaState {
  parentLocation: Quiz | AreaState;
  locationType: LocationType.Area;
  placeId: number;
  shortName: string;
  longName: string;
  userDefinedName: string;
  open: boolean;
  polygon: Polygon | MultiPolygon;
  displayBounds: google.maps.LatLngBoundsLiteral;
  searchBounds: google.maps.LatLngBoundsLiteral;
  sublocations: (AreaState | PointState)[];
}

export interface OpenStreetMapResponseItem {
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
  geojson: AllGeoJSON;
}

export interface PointState {
  parentLocation: Quiz | AreaState;
  locationType: LocationType.Point;
  placeId: string;
  shortName: string;
  longName: string;
  userDefinedName: string;
  point: Point;
}

export interface Quiz {
  locationType: LocationType.Quiz;
  sublocations: (AreaState | PointState)[];
}

export interface Dispatch {
  type: DispatchType;
}

export interface AddLocationDispatch extends Dispatch {
  type: DispatchType.Added;
  parentId: string;
  location: AreaState | PointState;
}

export interface ChangeLocationDispatch extends Dispatch {
  type: DispatchType.Changed;
  location: AreaState | PointState;
}

export interface DeleteLocationDispatch extends Dispatch {
  type: DispatchType.Deleted;
  location: AreaState | PointState;
}
