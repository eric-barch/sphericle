import { AllGeoJSON } from "@turf/helpers";
import { MultiPolygon, Point, Polygon } from "geojson";
import {
  FeatureType,
  QuizBuilderDispatchType,
  AllFeaturesDispatchType,
  QuizTakerDispatchType,
  SearchStatus,
} from "./enums";

export type AllFeatures = Map<string, BaseFeature>;

export type Feature = Root | AreaState | PointState;

export type BaseFeature = {
  id: string;
  type: FeatureType;
};

export type Parent = BaseFeature & {
  childIds: Set<string>;
};

export type Child = BaseFeature & {
  parentId: string;
  longName: string;
  shortName: string;
  userDefinedName: string | null;
  displayBounds: google.maps.LatLngBoundsLiteral;
};

export type Root = BaseFeature &
  Parent & {
    type: FeatureType.ROOT;
  };

export type AreaState = BaseFeature &
  Parent &
  Child & {
    type: FeatureType.AREA;
    osmId: number;
    searchBounds: google.maps.LatLngBoundsLiteral;
    polygon: Polygon | MultiPolygon;
  };

export type PointState = BaseFeature &
  Child & {
    type: FeatureType.POINT;
    googleId: string;
    point: Point;
  };

export type QuizBuilderState = {
  featureAdderFeature: Child | null;
  selectedId: string | null;
  addingId: string | null;
  renamingId: string | null;
  openIds: Set<string>;
};

export type QuizTakerState = {
  correctIds: Set<string>;
  incorrectIds: Set<string>;
  remainingIds: Set<string>;
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

export type OsmResult = {
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

export type AllFeaturesDispatch = AddChild | SetChildren | Rename | Delete;

type BaseAllFeaturesDispatch = {
  type: AllFeaturesDispatchType;
};

type AddChild = BaseAllFeaturesDispatch &
  (
    | {
        type: AllFeaturesDispatchType.ADD_CHILD;
        feature: Parent;
        childFeature: Child;
        featureId?: never;
      }
    | {
        type: AllFeaturesDispatchType.ADD_CHILD;
        featureId: string;
        childFeature: Child;
        feature?: never;
      }
  );

type SetChildren = BaseAllFeaturesDispatch &
  (
    | {
        type: AllFeaturesDispatchType.SET_CHILDREN;
        feature: Parent;
        childFeatureIds: string[];
        featureId?: never;
      }
    | {
        type: AllFeaturesDispatchType.SET_CHILDREN;
        featureId: string;
        childFeatureIds: string[];
        feature?: never;
      }
  );

type Rename = BaseAllFeaturesDispatch &
  (
    | {
        type: AllFeaturesDispatchType.RENAME;
        feature: Child;
        name: string;
        featureId?: never;
      }
    | {
        type: AllFeaturesDispatchType.RENAME;
        featureId: string;
        name: string;
        feature?: never;
      }
  );

type Delete = BaseAllFeaturesDispatch &
  (
    | {
        type: AllFeaturesDispatchType.DELETE;
        feature: Child;
        featureId?: never;
      }
    | {
        type: AllFeaturesDispatchType.DELETE;
        featureId: string;
        feature?: never;
      }
  );

export type QuizBuilderDispatch =
  | SetFeatureAdder
  | SetSelected
  | SetAdding
  | SetRenaming
  | SetIsOpen;

type BaseQuizBuilderDispatch = {
  type: QuizBuilderDispatchType;
};

type SetFeatureAdder = BaseQuizBuilderDispatch & {
  type: QuizBuilderDispatchType.SET_FEATURE_ADDER;
  feature: Child | null;
};

type SetSelected = BaseQuizBuilderDispatch &
  (
    | {
        type: QuizBuilderDispatchType.SET_SELECTED;
        feature: Child | null;
        featureId?: never;
      }
    | {
        type: QuizBuilderDispatchType.SET_SELECTED;
        featureId: string | null;
        feature?: never;
      }
  );

type SetAdding = BaseQuizBuilderDispatch &
  (
    | {
        type: QuizBuilderDispatchType.SET_ADDING;
        lastFeature: Parent | null;
        feature: Parent;
        featureId?: never;
      }
    | {
        type: QuizBuilderDispatchType.SET_ADDING;
        lastFeature: Parent | null;
        featureId: string;
        feature?: never;
      }
  );

type SetIsOpen = BaseQuizBuilderDispatch &
  (
    | {
        type: QuizBuilderDispatchType.SET_IS_OPEN;
        feature: Child;
        isOpen: boolean;
        featureId?: never;
      }
    | {
        type: QuizBuilderDispatchType.SET_IS_OPEN;
        featureId: string;
        isOpen: boolean;
        feature?: never;
      }
  );

type SetRenaming = BaseQuizBuilderDispatch &
  (
    | {
        type: QuizBuilderDispatchType.SET_RENAMING;
        feature: Child;
        featureId?: never;
      }
    | {
        type: QuizBuilderDispatchType.SET_RENAMING;
        featureId: string;
        feature?: never;
      }
  );

export type QuizTakerDispatch = Reset | MarkCorrect | MarkIncorrect;

type BaseQuizTakerDispatch = {
  type: QuizTakerDispatchType;
};

type Reset = BaseQuizTakerDispatch & {
  type: QuizTakerDispatchType.RESET;
};

type MarkCorrect = BaseQuizTakerDispatch &
  (
    | {
        type: QuizTakerDispatchType.MARK_CORRECT;
        feature: Child;
        featureId?: never;
      }
    | {
        type: QuizTakerDispatchType.MARK_CORRECT;
        featureId: string;
        feature?: never;
      }
  );

type MarkIncorrect = BaseQuizTakerDispatch &
  (
    | {
        type: QuizTakerDispatchType.MARK_INCORRECT;
        feature: Child;
        featureId?: never;
      }
    | {
        type: QuizTakerDispatchType.MARK_INCORRECT;
        featureId: string;
        feature?: never;
      }
  );
