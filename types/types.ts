import { AllGeoJSON } from "@turf/helpers";
import { MultiPolygon, Point, Polygon } from "geojson";
import { LocationType } from "./enums";

export type AreaState = {
  parentLocation: QuizState | AreaState;
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
};

export type OpenStreetMapResponseItem = {
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
};

export type PointState = {
  parentLocation: QuizState | AreaState;
  locationType: LocationType.Point;
  placeId: string;
  shortName: string;
  longName: string;
  userDefinedName: string;
  point: Point;
};

export type QuizState = {
  locationType: LocationType.Quiz;
  sublocations: (AreaState | PointState)[];
};
