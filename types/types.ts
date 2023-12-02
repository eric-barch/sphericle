import { AllGeoJSON } from "@turf/helpers";
import { MultiPolygon, Point, Polygon } from "geojson";
import { LocationType, QuizDispatchType } from "./enums";

export interface Quiz {
  id: string;
  locationType: LocationType.Quiz;
  isAdding: boolean;
  sublocations: (AreaState | PointState)[];
  selectedSublocation: AreaState | PointState;
}

export interface AreaState {
  id: string;
  openStreetMapPlaceId: number;
  parentLocation: Quiz | AreaState;
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
  parentLocation: Quiz | AreaState;
  locationType: LocationType.Point;
  shortName: string;
  longName: string;
  userDefinedName: string;
  isRenaming: boolean;
  point: Point;
  answeredCorrectly: boolean | null;
}

export type QuizDispatch =
  | AddedQuizDispatch
  | SelectedQuizDispatch
  | SetIsRenamingQuizDispatch
  | SetIsOpenQuizDispatch
  | SetIsAddingQuizDispatch
  | ReorderedSublocationsQuizDispatch
  | RenamedQuizDispatch
  | DeletedQuizDispatch;

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

interface BaseQuizDispatch {
  type: QuizDispatchType;
}

interface AddedQuizDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.Added;
  parent: Quiz | AreaState;
  location: AreaState | PointState;
}

interface SelectedQuizDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.Selected;
  location: AreaState | PointState;
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
