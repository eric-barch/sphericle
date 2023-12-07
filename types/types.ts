import { AllGeoJSON } from "@turf/helpers";
import { MultiPolygon, Point, Polygon } from "geojson";
import {
  ParentLocationDispatchType,
  LocationType,
  QuizDispatchType,
} from "./enums";

export interface QuizState {
  id: string;
  locationType: LocationType.Quiz;
  shortName: string;
  sublocations: (AreaState | PointState)[];
  builderSelected: AreaState | PointState | null;
  takerSelected: AreaState | PointState | null;
}

export interface AreaSearchResult {
  id: string;
  openStreetMapPlaceId: number;
  locationType: LocationType.Area;
  shortName: string;
  longName: string;
  userDefinedName: string;
  isOpen: boolean;
  polygon: Polygon | MultiPolygon;
  displayBounds: google.maps.LatLngBoundsLiteral;
  searchBounds: google.maps.LatLngBoundsLiteral;
  sublocations: (AreaState | PointState)[];
  answeredCorrectly: boolean | null;
}

export interface AreaState extends AreaSearchResult {
  parent: QuizState | AreaState;
}

export interface PointSearchResult {
  id: string;
  googlePlaceId: string;
  locationType: LocationType.Point;
  shortName: string;
  longName: string;
  userDefinedName: string;
  point: Point;
  answeredCorrectly: boolean | null;
}

export interface PointState extends PointSearchResult {
  parent: QuizState | AreaState;
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

export interface MapItems {
  bounds?: google.maps.LatLngBoundsLiteral;
  emptyAreas: AreaState[] | AreaState | null;
  filledAreas: AreaState[] | AreaState | null;
  points: PointState[] | PointState | null;
}

export type ParentLocationDispatch =
  | AddedSublocationDispatch
  | UpdatedIsOpenDispatch
  | RenamedDispatch
  | DeletedDispatch;

interface BaseParentLocationDispatch {
  type: ParentLocationDispatchType;
}

interface AddedSublocationDispatch extends BaseParentLocationDispatch {
  type: ParentLocationDispatchType.AddedSublocation;
  sublocation: AreaState | PointState;
}

interface UpdatedIsOpenDispatch extends BaseParentLocationDispatch {
  type: ParentLocationDispatchType.UpdatedIsOpen;
  isOpen: boolean;
}

interface RenamedDispatch extends BaseParentLocationDispatch {
  type: ParentLocationDispatchType.Renamed;
  name: string;
}

interface DeletedDispatch extends BaseParentLocationDispatch {
  type: ParentLocationDispatchType.Deleted;
}

export type QuizDispatch = SelectedBuilderLocationDispatch;

interface BaseQuizDispatch {
  type: QuizDispatchType;
}

interface SelectedBuilderLocationDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.SelectedBuilderLocation;
  location: AreaState | PointState | null;
}
