import { AllGeoJSON } from "@turf/helpers";
import { MultiPolygon, Point, Polygon } from "geojson";
import {
  FeatureType,
  QuizBuilderDispatchType,
  AllFeaturesDispatchType,
  QuizTakerDispatchType,
  SearchStatus,
} from "./enums";

export type AllFeatures = Map<string, BaseFeatureState>;

export interface BaseFeatureState {
  featureId: string;
  featureType: FeatureType;
}

export interface ParentFeatureState extends BaseFeatureState {
  subfeatureIds: Set<string>;
}

export interface SubfeatureState extends BaseFeatureState {
  parentFeatureId: string;
  longName: string;
  shortName: string;
  userDefinedName: string | null;
  displayBounds: google.maps.LatLngBoundsLiteral;
}

export interface RootState extends BaseFeatureState, ParentFeatureState {
  featureType: FeatureType.ROOT;
}

export interface AreaState
  extends BaseFeatureState,
    ParentFeatureState,
    SubfeatureState {
  featureType: FeatureType.AREA;
  openStreetMapPlaceId: number;
  searchBounds: google.maps.LatLngBoundsLiteral;
  polygons: Polygon | MultiPolygon;
}

export interface PointState extends BaseFeatureState, SubfeatureState {
  featureType: FeatureType.POINT;
  googlePlacesId: string;
  point: Point;
}

export type FeatureState = RootState | AreaState | PointState;

export interface QuizBuilderState {
  featureAdderFeatureState: SubfeatureState | null;
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

export interface AreaSearch {
  term: string;
  status: SearchStatus;
  results: AreaState[];
  setTerm: (searchTerm: string) => void;
  reset: () => void;
}

export interface PointSearch {
  term: string;
  status: SearchStatus;
  results: PointState[];
  setTerm: (searchTerm: string) => void;
  reset: () => void;
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

export type QuizBuilderDispatch =
  | SetFeatureAdderSelectedDispatch
  | SetSelectedDispatch
  | SetAddingDispatch
  | SetIsOpenDispatch
  | SetRenamingDispatch;

type BaseQuizBuilderStateDispatch = {
  dispatchType: QuizBuilderDispatchType;
};

type SetFeatureAdderSelectedDispatch = BaseQuizBuilderStateDispatch & {
  dispatchType: QuizBuilderDispatchType.SET_FEATURE_ADDER_SELECTED;
  featureState: SubfeatureState | null;
};

type SetSelectedDispatch = BaseQuizBuilderStateDispatch &
  (
    | {
        dispatchType: QuizBuilderDispatchType.SET_SELECTED;
        featureState: SubfeatureState | null;
        featureId?: never;
      }
    | {
        dispatchType: QuizBuilderDispatchType.SET_SELECTED;
        featureId: string | null;
        featureState?: never;
      }
  );

type SetAddingDispatch = BaseQuizBuilderStateDispatch &
  (
    | {
        dispatchType: QuizBuilderDispatchType.SET_ADDING;
        lastFeatureState: ParentFeatureState | null;
        featureState: ParentFeatureState;
        featureId?: never;
      }
    | {
        dispatchType: QuizBuilderDispatchType.SET_ADDING;
        lastFeatureState: ParentFeatureState | null;
        featureId: string;
        featureState?: never;
      }
  );

type SetIsOpenDispatch = BaseQuizBuilderStateDispatch &
  (
    | {
        dispatchType: QuizBuilderDispatchType.SET_IS_OPEN;
        featureState: SubfeatureState;
        isOpen: boolean;
        featureId?: never;
      }
    | {
        dispatchType: QuizBuilderDispatchType.SET_IS_OPEN;
        featureId: string;
        isOpen: boolean;
        featureState?: never;
      }
  );

type SetRenamingDispatch = BaseQuizBuilderStateDispatch &
  (
    | {
        dispatchType: QuizBuilderDispatchType.SET_RENAMING;
        featureState: SubfeatureState;
        featureId?: never;
      }
    | {
        dispatchType: QuizBuilderDispatchType.SET_RENAMING;
        featureId: string;
        featureState?: never;
      }
  );

export type QuizTakerDispatch =
  | ResetDispatch
  | MarkCorrectDispatch
  | MarkIncorrectDispatch;

type BaseQuizTakerStateDispatch = {
  dispatchType: QuizTakerDispatchType;
};

type ResetDispatch = BaseQuizTakerStateDispatch & {
  dispatchType: QuizTakerDispatchType.RESET;
};

type MarkCorrectDispatch = BaseQuizTakerStateDispatch &
  (
    | {
        dispatchType: QuizTakerDispatchType.MARK_CORRECT;
        featureState: SubfeatureState;
        featureId?: never;
      }
    | {
        dispatchType: QuizTakerDispatchType.MARK_CORRECT;
        featureId: string;
        featureState?: never;
      }
  );

type MarkIncorrectDispatch = BaseQuizTakerStateDispatch &
  (
    | {
        dispatchType: QuizTakerDispatchType.MARK_INCORRECT;
        featureState: SubfeatureState;
        featureId?: never;
      }
    | {
        dispatchType: QuizTakerDispatchType.MARK_INCORRECT;
        featureId: string;
        featureState?: never;
      }
  );
