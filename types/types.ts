import { AllGeoJSON } from "@turf/helpers";
import { MultiPolygon, Point, Polygon } from "geojson";
import { LocationType } from "./enums";

export interface Quiz {
  id: string;
  locationType: LocationType.Quiz;
  sublocations: (AreaState | PointState)[];
  selectedSublocationId: string;
}

export interface AreaState {
  id: string;
  openStreetMapPlaceId: number;
  parentLocation: Quiz | AreaState;
  locationType: LocationType.Area;
  shortName: string;
  longName: string;
  userDefinedName: string;
  open: boolean;
  polygon: Polygon | MultiPolygon;
  displayBounds: google.maps.LatLngBoundsLiteral;
  searchBounds: google.maps.LatLngBoundsLiteral;
  sublocations: (AreaState | PointState)[];
}

export interface PointState {
  id: string;
  googlePlaceId: string;
  parentLocation: Quiz | AreaState;
  locationType: LocationType.Point;
  shortName: string;
  longName: string;
  userDefinedName: string;
  point: Point;
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
