import { AllGeoJSON } from "@turf/helpers";
import { MultiPolygon, Point, Polygon } from "geojson";
import {
  FeatureType,
  QuizBuilderDispatchType,
  AllFeaturesDispatchType,
  QuizTakerDispatchType,
} from "./enums";

export interface AllFeatures {
  rootId: string;
  features: { [key: string]: RootState | AreaState | PointState };
}

export interface RootState {
  id: string;
  subfeatureIds: string[];
  featureType: FeatureType.ROOT;
}

export interface AreaState {
  id: string;
  parentId: string;
  subfeatureIds: string[];
  featureType: FeatureType.AREA;
  openStreetMapPlaceId: number;
  longName: string;
  shortName: string;
  userDefinedName: string | null;
  isOpen: boolean;
  isAdding: boolean;
  searchBounds: google.maps.LatLngBoundsLiteral;
  displayBounds: google.maps.LatLngBoundsLiteral;
  polygons: Polygon | MultiPolygon;
}

export interface PointState {
  id: string;
  parentId: string;
  featureType: FeatureType.POINT;
  googlePlacesId: string;
  longName: string;
  shortName: string;
  userDefinedName: string | null;
  displayBounds: google.maps.LatLngBoundsLiteral;
  point: Point;
  answeredCorrectly: boolean | null;
}

export interface QuizBuilderState {
  activeOption: AreaState | PointState | null;
  selectedId: string | null;
}

export interface QuizTakerState {
  orderedIds: string[];
  currentIndex: number;
  correctIds: Set<string>;
  incorrectIds: Set<string>;
}

export interface OsmItem {
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

export type AllFeaturesDispatch =
  | AddSubfeatureDispatch
  | SetSubfeaturesDispatch
  | RenameFeatureDispatch
  | SetAreaIsOpenDispatch
  | SetAreaIsAddingDispatch
  | DeleteFeatureDispatch;

interface BaseAllFeaturesDispatch {
  type: AllFeaturesDispatchType;
}

interface AddSubfeatureDispatch extends BaseAllFeaturesDispatch {
  type: AllFeaturesDispatchType.ADD_SUBFEATURE;
  parentId: string;
  subfeature: AreaState | PointState;
}

interface SetSubfeaturesDispatch extends BaseAllFeaturesDispatch {
  type: AllFeaturesDispatchType.SET_SUBFEATURES;
  featureId: string;
  subfeatureIds: string[];
}

interface RenameFeatureDispatch extends BaseAllFeaturesDispatch {
  type: AllFeaturesDispatchType.RENAME_FEATURE;
  featureId: string;
  name: string;
}

interface SetAreaIsOpenDispatch extends BaseAllFeaturesDispatch {
  type: AllFeaturesDispatchType.SET_AREA_IS_OPEN;
  featureId: string;
  isOpen: boolean;
}

interface SetAreaIsAddingDispatch extends BaseAllFeaturesDispatch {
  type: AllFeaturesDispatchType.SET_AREA_IS_ADDING;
  featureId: string;
  isAdding: boolean;
}

interface DeleteFeatureDispatch extends BaseAllFeaturesDispatch {
  type: AllFeaturesDispatchType.DELETE_FEATURE;
  featureId: string;
}

export type QuizBuilderDispatch =
  | SetActiveOptionDispatch
  | SetSelectedFeatureDispatch;

interface BaseQuizBuilderDispatch {
  type: QuizBuilderDispatchType;
}

interface SetActiveOptionDispatch extends BaseQuizBuilderDispatch {
  type: QuizBuilderDispatchType.SET_ACTIVE_OPTION;
  activeOption: AreaState | PointState | null;
}

interface SetSelectedFeatureDispatch extends BaseQuizBuilderDispatch {
  type: QuizBuilderDispatchType.SET_SELECTED_FEATURE;
  featureId: string;
}

export type QuizTakerDispatch =
  | ResetDispatch
  | MarkCorrectDispatch
  | MarkIncorrectDispatch;

interface BaseQuizTakerDispatch {
  type: QuizTakerDispatchType;
}

interface ResetDispatch extends BaseQuizTakerDispatch {
  type: QuizTakerDispatchType.RESET;
  allFeatures: AllFeatures;
}

interface MarkCorrectDispatch extends BaseQuizTakerDispatch {
  type: QuizTakerDispatchType.MARK_CORRECT;
}

interface MarkIncorrectDispatch extends BaseQuizTakerDispatch {
  type: QuizTakerDispatchType.MARK_INCORRECT;
}
