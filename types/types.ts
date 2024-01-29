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
  featureId: string;
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
  featureAdderFeatureState: SubfeatureState | null;
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
  | RenameDispatch
  | DeleteDispatch;

interface BaseAllFeaturesDispatch {
  dispatchType: AllFeaturesDispatchType;
}

interface AddSubfeatureDispatch extends BaseAllFeaturesDispatch {
  dispatchType: AllFeaturesDispatchType.ADD_SUBFEATURE;
  featureState: ParentFeatureState;
  subfeatureState: SubfeatureState;
}

interface SetSubfeaturesDispatch extends BaseAllFeaturesDispatch {
  dispatchType: AllFeaturesDispatchType.SET_SUBFEATURES;
  featureState: ParentFeatureState;
  subfeatureIds: string[];
}

interface RenameDispatch extends BaseAllFeaturesDispatch {
  dispatchType: AllFeaturesDispatchType.RENAME;
  featureState: SubfeatureState;
  name: string;
}

interface DeleteDispatch extends BaseAllFeaturesDispatch {
  dispatchType: AllFeaturesDispatchType.DELETE;
  featureState: SubfeatureState;
}

export type QuizBuilderStateDispatch =
  | SetFeatureAdderSelectedDispatch
  | SetSelectedDispatch
  | SetIsAddingDispatch
  | SetIsOpenDispatch
  | SetIsRenamingDispatch;

interface BaseQuizBuilderStateDispatch {
  dispatchType: QuizBuilderStateDispatchType;
}

interface SetFeatureAdderSelectedDispatch extends BaseQuizBuilderStateDispatch {
  dispatchType: QuizBuilderStateDispatchType.SET_FEATURE_ADDER_SELECTED;
  featureState: SubfeatureState | null;
}

interface SetSelectedDispatch extends BaseQuizBuilderStateDispatch {
  dispatchType: QuizBuilderStateDispatchType.SET_SELECTED;
  featureState: SubfeatureState | null;
}

interface SetIsAddingDispatch extends BaseQuizBuilderStateDispatch {
  dispatchType: QuizBuilderStateDispatchType.SET_IS_ADDING;
  featureState: FeatureState;
  isAdding: boolean;
}

interface SetIsOpenDispatch extends BaseQuizBuilderStateDispatch {
  dispatchType: QuizBuilderStateDispatchType.SET_IS_OPEN;
  featureState: SubfeatureState;
  isOpen: boolean;
}

interface SetIsRenamingDispatch extends BaseQuizBuilderStateDispatch {
  dispatchType: QuizBuilderStateDispatchType.SET_IS_RENAMING;
  featureState: SubfeatureState;
  isRenaming: boolean;
}

export type QuizTakerStateDispatch =
  | ResetDispatch
  | MarkCorrectDispatch
  | MarkIncorrectDispatch;

interface BaseQuizTakerStateDispatch {
  dispatchType: QuizTakerStateDispatchType;
}

interface ResetDispatch extends BaseQuizTakerStateDispatch {
  dispatchType: QuizTakerStateDispatchType.RESET;
  rootId: string;
  allFeatures: AllFeatures;
}

interface MarkCorrectDispatch extends BaseQuizTakerStateDispatch {
  dispatchType: QuizTakerStateDispatchType.MARK_CORRECT;
  featureState: SubfeatureState;
}

interface MarkIncorrectDispatch extends BaseQuizTakerStateDispatch {
  dispatchType: QuizTakerStateDispatchType.MARK_INCORRECT;
  featureState: SubfeatureState;
}
