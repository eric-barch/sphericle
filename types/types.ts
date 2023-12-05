import { AllGeoJSON } from "@turf/helpers";
import { MultiPolygon, Point, Polygon } from "geojson";
import { LocationType, QuizDispatchType } from "./enums";

export interface Quiz {
  id: string;
  locationType: LocationType.Quiz;
  isAdding: boolean;
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
  isRenaming: boolean;
  isOpen: boolean;
  isAdding: boolean;
  polygon: Polygon | MultiPolygon;
  displayBounds: google.maps.LatLngBoundsLiteral;
  searchBounds: google.maps.LatLngBoundsLiteral;
  sublocations: (AreaState | PointState)[];
  answeredCorrectly: boolean | null;
}

export interface AreaState extends AreaSearchResult {
  parent: Quiz | AreaState;
}

export interface PointSearchResult {
  id: string;
  googlePlaceId: string;
  locationType: LocationType.Point;
  shortName: string;
  longName: string;
  userDefinedName: string;
  isRenaming: boolean;
  point: Point;
  answeredCorrectly: boolean | null;
}

export interface PointState extends PointSearchResult {
  parent: Quiz | AreaState;
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
  | AddedLocationDispatch
  | SelectedBuilderLocationDispatch
  | SelectedTakerLocationDispatch
  | UpdatedLocationIsRenamingDispatch
  | UpdatedLocationIsOpenDispatch
  | UpdatedLocationIsAddingDispatch
  | ReorderedSublocationsDispatch
  | RenamedLocationDispatch
  | DeletedLocationDispatch
  | IncrementedTakerLocationDispatch;

interface BaseQuizDispatch {
  type: QuizDispatchType;
}

interface AddedLocationDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.AddedLocation;
  parent: Quiz | AreaState;
  location: AreaState | PointState;
}

interface SelectedBuilderLocationDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.SelectedBuilderLocation;
  location: AreaState | PointState | null;
}

interface SelectedTakerLocationDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.SelectedTakerLocation;
  location: AreaState | PointState | null;
}

interface UpdatedLocationIsRenamingDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.UpdatedLocationIsRenaming;
  location: AreaState | PointState;
  isRenaming: boolean;
}

interface UpdatedLocationIsOpenDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.UpdatedLocationIsOpen;
  location: AreaState;
  isOpen: boolean;
}

interface UpdatedLocationIsAddingDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.UpdatedLocationIsAdding;
  location: AreaState;
  isAdding: boolean;
}

interface ReorderedSublocationsDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.ReorderedSublocations;
  parent: Quiz | AreaState;
  sublocations: (AreaState | PointState)[];
}

interface RenamedLocationDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.RenamedLocation;
  location: AreaState | PointState;
  name: string;
}

interface DeletedLocationDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.DeletedLocation;
  location: AreaState | PointState;
}

interface IncrementedTakerLocationDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.IncrementedTakerLocation;
}
