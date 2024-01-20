import { AllGeoJSON } from "@turf/helpers";
import { MultiPolygon, Point, Polygon } from "geojson";
import {
  FeatureType,
  QuizBuilderStateDispatchType,
  AllFeaturesDispatchType,
  QuizTakerStateDispatchType,
} from "./enums";

export type AllFeatures = Map<string, RootState | AreaState | PointState>;

export interface FeatureState {
  id: string;
  featureType: FeatureType;
}

export interface ParentFeatureState extends FeatureState {
  subfeatureIds: Set<string>;
}

export interface SubfeatureState extends FeatureState {
  parentFeatureId: string;
  longName: string;
  shortName: string;
  userDefinedName: string | null;
  displayBounds: google.maps.LatLngBoundsLiteral;
}

export interface RootState extends FeatureState, ParentFeatureState {
  featureType: FeatureType.ROOT;
}

export interface AreaState
  extends FeatureState,
    ParentFeatureState,
    SubfeatureState {
  featureType: FeatureType.AREA;
  openStreetMapPlaceId: number;
  searchBounds: google.maps.LatLngBoundsLiteral;
  polygons: Polygon | MultiPolygon;
}

export interface PointState extends FeatureState, SubfeatureState {
  featureType: FeatureType.POINT;
  googlePlacesId: string;
  point: Point;
}

export interface QuizBuilderState {
  activeSearchOption: AreaState | PointState | null;
  selectedFeatureId: string | null;
  openAreas: Set<string>;
  addingAreas: Set<string>;
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

interface DeleteFeatureDispatch extends BaseAllFeaturesDispatch {
  type: AllFeaturesDispatchType.DELETE_FEATURE;
  featureId: string;
}

export type QuizBuilderStateDispatch =
  | SetActiveOptionDispatch
  | SetSelectedFeatureDispatch
  | SetAreaIsAddingDispatch
  | SetAreaIsOpenDispatch;

interface BaseQuizBuilderStateDispatch {
  type: QuizBuilderStateDispatchType;
}

interface SetActiveOptionDispatch extends BaseQuizBuilderStateDispatch {
  type: QuizBuilderStateDispatchType.SET_ACTIVE_SEARCH_OPTION;
  activeSearchOption: AreaState | PointState | null;
}

interface SetSelectedFeatureDispatch extends BaseQuizBuilderStateDispatch {
  type: QuizBuilderStateDispatchType.SET_SELECTED_FEATURE;
  selectedFeatureId: string;
}

interface SetAreaIsAddingDispatch extends BaseQuizBuilderStateDispatch {
  type: QuizBuilderStateDispatchType.SET_AREA_IS_ADDING;
  featureId: string;
  isAdding: boolean;
}

interface SetAreaIsOpenDispatch extends BaseQuizBuilderStateDispatch {
  type: QuizBuilderStateDispatchType.SET_AREA_IS_OPEN;
  featureId: string;
  isOpen: boolean;
}

export type QuizTakerStateDispatch =
  | ResetDispatch
  | MarkCorrectDispatch
  | MarkIncorrectDispatch;

interface BaseQuizTakerStateDispatch {
  type: QuizTakerStateDispatchType;
}

interface ResetDispatch extends BaseQuizTakerStateDispatch {
  type: QuizTakerStateDispatchType.RESET;
  rootId: string;
  allFeatures: AllFeatures;
}

interface MarkCorrectDispatch extends BaseQuizTakerStateDispatch {
  type: QuizTakerStateDispatchType.MARK_CORRECT;
  featureId: string;
}

interface MarkIncorrectDispatch extends BaseQuizTakerStateDispatch {
  type: QuizTakerStateDispatchType.MARK_INCORRECT;
  featureId: string;
}
