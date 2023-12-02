import { AllGeoJSON } from "@turf/helpers";
import { MultiPolygon, Point, Polygon } from "geojson";
import { LocationType, QuizDispatchType } from "./enums";

export interface Quiz {
  id: string;
  locationType: LocationType.Quiz;
  isAdding: boolean;
  sublocations: (AreaState | PointState)[];
  buildSelected: AreaState | PointState | null;
  takeSelected: AreaState | PointState | null;
}

export interface AreaState {
  id: string;
  openStreetMapPlaceId: number;
  parent: Quiz | AreaState;
  locationType: LocationType.Area;
  shortName: string;
  longName: string;
  userDefinedName: string;
  isRenaming: boolean;
  isOpen: boolean;
  isAdding: boolean;
  polygon: Polygon | MultiPolygon;
  displayBounds: google.maps.LatLngBoundsLiteral;
  searchBounds: google.maps.LatLngBoundsLiteral;
  sublocations: (AreaState | PointState)[];
  answeredCorrectly: boolean | null;
}

export interface PointState {
  id: string;
  googlePlaceId: string;
  parent: Quiz | AreaState;
  locationType: LocationType.Point;
  shortName: string;
  longName: string;
  userDefinedName: string;
  isRenaming: boolean;
  point: Point;
  answeredCorrectly: boolean | null;
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

export type QuizDispatch =
  | AddedQuizDispatch
  | BuildSelectedQuizDispatch
  | TakeSelectedQuizDispatch
  | SetIsRenamingQuizDispatch
  | SetIsOpenQuizDispatch
  | SetIsAddingQuizDispatch
  | ReorderedSublocationsQuizDispatch
  | RenamedQuizDispatch
  | DeletedQuizDispatch;

interface BaseQuizDispatch {
  type: QuizDispatchType;
}

interface AddedQuizDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.Added;
  parent: Quiz | AreaState;
  location: AreaState | PointState;
}

interface BuildSelectedQuizDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.BuildSelected;
  location: AreaState | PointState | null;
}

interface TakeSelectedQuizDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.TakeSelected;
  location: AreaState | PointState | null;
}

interface SetIsRenamingQuizDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.SetIsRenaming;
  location: AreaState | PointState;
  isRenaming: boolean;
}

interface SetIsOpenQuizDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.SetIsOpen;
  location: AreaState;
  isOpen: boolean;
}

interface SetIsAddingQuizDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.SetIsAdding;
  location: AreaState;
  isAdding: boolean;
}

interface ReorderedSublocationsQuizDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.ReorderedSublocations;
  parent: Quiz | AreaState;
  sublocations: (AreaState | PointState)[];
}

interface RenamedQuizDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.Renamed;
  location: AreaState | PointState;
  name: string;
}

interface DeletedQuizDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.Deleted;
  location: AreaState | PointState;
}
