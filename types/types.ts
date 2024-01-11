import { AllGeoJSON } from "@turf/helpers";
import { MultiPolygon, Point, Polygon } from "geojson";
import {
  FeatureType,
  QuizBuilderStateDispatchType,
  AllFeaturesDispatchType,
  QuizTakerStateDispatchType,
} from "./enums";

export type AllFeatures = Map<string, RootState | AreaState | PointState>;

export interface RootState {
  id: string;
  subfeatureIds: Set<string>;
  featureType: FeatureType.ROOT;
}

export interface AreaState {
  id: string;
  parentFeatureId: string;
  subfeatureIds: Set<string>;
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
  parentFeatureId: string;
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
  activeSearchOption: AreaState | PointState | null;
  selectedFeatureId: string | null;
}

export interface QuizTakerState {
  correctFeatureIds: Set<string>;
  incorrectFeatureIds: Set<string>;
  remainingFeatureIds: Set<string>;
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
  parentFeatureId: string;
  subfeature: AreaState | PointState;
}

interface SetSubfeaturesDispatch extends BaseAllFeaturesDispatch {
  type: AllFeaturesDispatchType.SET_SUBFEATURES;
  parentFeatureId: string;
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

export type QuizBuilderStateDispatch =
  | SetActiveOptionDispatch
  | SetSelectedDispatch;

interface BaseQuizBuilderDispatch {
  type: QuizBuilderStateDispatchType;
}

interface SetActiveOptionDispatch extends BaseQuizBuilderDispatch {
  type: QuizBuilderStateDispatchType.SET_ACTIVE_OPTION;
  activeOption: AreaState | PointState | null;
}

interface SetSelectedDispatch extends BaseQuizBuilderDispatch {
  type: QuizBuilderStateDispatchType.SET_SELECTED;
  featureId: string;
}

export type QuizTakerStateDispatch =
  | ResetDispatch
  | MarkCorrectDispatch
  | MarkIncorrectDispatch;

interface BaseQuizTakerDispatch {
  type: QuizTakerStateDispatchType;
}

interface ResetDispatch extends BaseQuizTakerDispatch {
  type: QuizTakerStateDispatchType.RESET;
  rootId: string;
  allFeatures: AllFeatures;
}

interface MarkCorrectDispatch extends BaseQuizTakerDispatch {
  type: QuizTakerStateDispatchType.MARK_CORRECT;
  featureId: string;
}

interface MarkIncorrectDispatch extends BaseQuizTakerDispatch {
  type: QuizTakerStateDispatchType.MARK_INCORRECT;
  featureId: string;
}
