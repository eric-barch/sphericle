import { MultiPolygon, Point, Polygon } from "geojson";
import { LocationType } from "./enums";
import { AllGeoJSON } from "@turf/helpers";

export type AreaState = {
  parent: TreeState | AreaState;
  locationType: LocationType.Area;
  placeId: number;
  displayName: string;
  fullName: string;
  open: boolean;
  polygon: Polygon | MultiPolygon;
  bounds: google.maps.LatLngBoundsLiteral;
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
  parent: TreeState | AreaState;
  locationType: LocationType.Point;
  placeId: string;
  displayName: string;
  fullName: string;
  point: Point;
};

export type TreeState = {
  locationType: LocationType.Tree;
  displayName: string;
  sublocations: (AreaState | PointState)[];
};
