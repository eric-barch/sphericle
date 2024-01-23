import { AllGeoJSON } from "@turf/helpers";
import { MultiPolygon, Point, Polygon } from "geojson";
import {
  FeatureType,
  QuizBuilderStateDispatchType,
  AllFeaturesDispatchType,
  QuizTakerStateDispatchType,
} from "./enums";

export type AllFeatures = Map<string, FeatureState>;

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
  activeSearchOption: SubfeatureState | null;
  selectedFeatureId: string | null;
  openFeatureIds: Set<string>;
  addingFeatureIds: Set<string>;
  renamingFeatureIds: Set<string>;
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
  parentFeature: ParentFeatureState;
  subfeature: SubfeatureState;
}

interface SetSubfeaturesDispatch extends BaseAllFeaturesDispatch {
  type: AllFeaturesDispatchType.SET_SUBFEATURES;
  parentFeature: ParentFeatureState;
  subfeatureIds: string[];
}

interface RenameFeatureDispatch extends BaseAllFeaturesDispatch {
  type: AllFeaturesDispatchType.RENAME_FEATURE;
  feature: SubfeatureState;
  name: string;
}

interface DeleteFeatureDispatch extends BaseAllFeaturesDispatch {
  type: AllFeaturesDispatchType.DELETE_FEATURE;
  feature: SubfeatureState;
}

export type QuizBuilderStateDispatch =
  | SetActiveOptionDispatch
  | SetSelectedFeatureDispatch
  | SetFeatureIsAddingDispatch
  | SetFeatureIsOpenDispatch
  | SetFeatureIsRenamingDispatch;

interface BaseQuizBuilderStateDispatch {
  type: QuizBuilderStateDispatchType;
}

interface SetActiveOptionDispatch extends BaseQuizBuilderStateDispatch {
  type: QuizBuilderStateDispatchType.SET_ACTIVE_SEARCH_OPTION;
  activeSearchOption: SubfeatureState | null;
}

interface SetSelectedFeatureDispatch extends BaseQuizBuilderStateDispatch {
  type: QuizBuilderStateDispatchType.SET_SELECTED_FEATURE;
  feature: SubfeatureState;
}

interface SetFeatureIsAddingDispatch extends BaseQuizBuilderStateDispatch {
  type: QuizBuilderStateDispatchType.SET_FEATURE_IS_ADDING;
  feature: SubfeatureState;
  isAdding: boolean;
}

interface SetFeatureIsOpenDispatch extends BaseQuizBuilderStateDispatch {
  type: QuizBuilderStateDispatchType.SET_FEATURE_IS_OPEN;
  feature: SubfeatureState;
  isOpen: boolean;
}

interface SetFeatureIsRenamingDispatch extends BaseQuizBuilderStateDispatch {
  type: QuizBuilderStateDispatchType.SET_FEATURE_IS_RENAMING;
  feature: SubfeatureState;
  isRenaming: boolean;
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
  feature: SubfeatureState;
}

interface MarkIncorrectDispatch extends BaseQuizTakerStateDispatch {
  type: QuizTakerStateDispatchType.MARK_INCORRECT;
  feature: SubfeatureState;
}
