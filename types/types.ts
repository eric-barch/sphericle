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
  featureAdderSelectedFeatureState: SubfeatureState | null;
  selectedFeatureId: string | null;
  addingFeatureId: string | null;
  renamingFeatureId: string | null;
  openFeatureIds: Set<string>;
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

type BaseAllFeaturesDispatch = {
  dispatchType: AllFeaturesDispatchType;
};

type AddSubfeatureDispatch = BaseAllFeaturesDispatch &
  (
    | {
        dispatchType: AllFeaturesDispatchType.ADD_SUBFEATURE;
        featureState: ParentFeatureState;
        subfeatureState: SubfeatureState;
        featureId?: never;
      }
    | {
        dispatchType: AllFeaturesDispatchType.ADD_SUBFEATURE;
        featureId: string;
        subfeatureState: SubfeatureState;
        featureState?: never;
      }
  );

type SetSubfeaturesDispatch = BaseAllFeaturesDispatch &
  (
    | {
        dispatchType: AllFeaturesDispatchType.SET_SUBFEATURES;
        featureState: ParentFeatureState;
        subfeatureIds: string[];
        featureId?: never;
      }
    | {
        dispatchType: AllFeaturesDispatchType.SET_SUBFEATURES;
        featureId: string;
        subfeatureIds: string[];
        featureState?: never;
      }
  );

type RenameDispatch = BaseAllFeaturesDispatch &
  (
    | {
        dispatchType: AllFeaturesDispatchType.RENAME;
        featureState: SubfeatureState;
        name: string;
        featureId?: never;
      }
    | {
        dispatchType: AllFeaturesDispatchType.RENAME;
        featureId: string;
        name: string;
        featureState?: never;
      }
  );

type DeleteDispatch = BaseAllFeaturesDispatch &
  (
    | {
        dispatchType: AllFeaturesDispatchType.DELETE;
        featureState: SubfeatureState;
        featureId?: never;
      }
    | {
        dispatchType: AllFeaturesDispatchType.DELETE;
        featureId: string;
        featureState?: never;
      }
  );

export type QuizBuilderStateDispatch =
  | SetFeatureAdderSelectedDispatch
  | SetSelectedDispatch
  | SetIsAddingDispatch
  | SetIsOpenDispatch
  | SetIsRenamingDispatch;

type BaseQuizBuilderStateDispatch = {
  dispatchType: QuizBuilderStateDispatchType;
};

type SetFeatureAdderSelectedDispatch = BaseQuizBuilderStateDispatch & {
  dispatchType: QuizBuilderStateDispatchType.SET_FEATURE_ADDER_SELECTED;
  featureState: SubfeatureState | null;
};

type SetSelectedDispatch = BaseQuizBuilderStateDispatch &
  (
    | {
        dispatchType: QuizBuilderStateDispatchType.SET_SELECTED;
        featureState: SubfeatureState | null;
        featureId?: never;
      }
    | {
        dispatchType: QuizBuilderStateDispatchType.SET_SELECTED;
        featureId: string | null;
        featureState?: never;
      }
  );

type SetIsAddingDispatch = BaseQuizBuilderStateDispatch &
  (
    | {
        dispatchType: QuizBuilderStateDispatchType.SET_ADDING;
        featureState: FeatureState;
        isAdding: boolean;
        featureId?: never;
      }
    | {
        dispatchType: QuizBuilderStateDispatchType.SET_ADDING;
        featureId: string;
        isAdding: boolean;
        featureState?: never;
      }
  );

type SetIsOpenDispatch = BaseQuizBuilderStateDispatch &
  (
    | {
        dispatchType: QuizBuilderStateDispatchType.SET_IS_OPEN;
        featureState: SubfeatureState;
        isOpen: boolean;
        featureId?: never;
      }
    | {
        dispatchType: QuizBuilderStateDispatchType.SET_IS_OPEN;
        featureId: string;
        isOpen: boolean;
        featureState?: never;
      }
  );

type SetIsRenamingDispatch = BaseQuizBuilderStateDispatch &
  (
    | {
        dispatchType: QuizBuilderStateDispatchType.SET_RENAMING;
        featureState: SubfeatureState;
        isRenaming: boolean;
        featureId?: never;
      }
    | {
        dispatchType: QuizBuilderStateDispatchType.SET_RENAMING;
        featureId: string;
        isRenaming: boolean;
        featureState?: never;
      }
  );

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
