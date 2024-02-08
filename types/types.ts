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

export type BaseFeatureState = {
  featureId: string;
  featureType: FeatureType;
};

export type ParentFeatureState = BaseFeatureState & {
  subfeatureIds: Set<string>;
};

export type SubfeatureState = BaseFeatureState & {
  parentFeatureId: string;
  longName: string;
  shortName: string;
  userDefinedName: string | null;
  displayBounds: google.maps.LatLngBoundsLiteral;
};

export type RootState = BaseFeatureState &
  ParentFeatureState & {
    featureType: FeatureType.ROOT;
  };

export type AreaState = BaseFeatureState &
  ParentFeatureState &
  SubfeatureState & {
    featureType: FeatureType.AREA;
    openStreetMapPlaceId: number;
    searchBounds: google.maps.LatLngBoundsLiteral;
    polygons: Polygon | MultiPolygon;
  };

export type PointState = BaseFeatureState &
  SubfeatureState & {
    featureType: FeatureType.POINT;
    googlePlacesId: string;
    point: Point;
  };

export type FeatureState = RootState | AreaState | PointState;

export type QuizBuilderState = {
  featureAdderFeature: SubfeatureState | null;
  selectedFeatureId: string | null;
  addingFeatureId: string | null;
  renamingFeatureId: string | null;
  openFeatureIds: Set<string>;
};

export type QuizTakerState = {
  correctFeatureIds: Set<string>;
  incorrectFeatureIds: Set<string>;
  remainingFeatureIds: Set<string>;
};

export type AreaSearch = {
  term: string;
  status: SearchStatus;
  results: AreaState[];
  setTerm: (searchTerm: string) => void;
  reset: () => void;
};

export type PointSearch = {
  term: string;
  status: SearchStatus;
  results: PointState[];
  setTerm: (searchTerm: string) => void;
  reset: () => void;
};

export type OsmItem = {
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
};

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

type BaseQuizBuilderDispatch = {
  dispatchType: QuizBuilderDispatchType;
};

type SetFeatureAdderSelectedDispatch = BaseQuizBuilderDispatch & {
  dispatchType: QuizBuilderDispatchType.SET_FEATURE_ADDER_SELECTED;
  featureState: SubfeatureState | null;
};

type SetSelectedDispatch = BaseQuizBuilderDispatch &
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

type SetAddingDispatch = BaseQuizBuilderDispatch &
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

type SetIsOpenDispatch = BaseQuizBuilderDispatch &
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

type SetRenamingDispatch = BaseQuizBuilderDispatch &
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

type BaseQuizTakerDispatch = {
  dispatchType: QuizTakerDispatchType;
};

type ResetDispatch = BaseQuizTakerDispatch & {
  dispatchType: QuizTakerDispatchType.RESET;
};

type MarkCorrectDispatch = BaseQuizTakerDispatch &
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

type MarkIncorrectDispatch = BaseQuizTakerDispatch &
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
