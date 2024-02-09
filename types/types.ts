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

export type ParentFeature = BaseFeature & {
  childIds: Set<string>;
};

export type ChildFeature = BaseFeature & {
  parentId: string;
  longName: string;
  shortName: string;
  userDefinedName: string | null;
  displayBounds: google.maps.LatLngBoundsLiteral;
};

export type Root = BaseFeature &
  ParentFeature & {
    type: FeatureType.ROOT;
  };

export type AreaState = BaseFeature &
  ParentFeature &
  ChildFeature & {
    type: FeatureType.AREA;
    osmId: number;
    searchBounds: google.maps.LatLngBoundsLiteral;
    polygon: Polygon | MultiPolygon;
  };

export type PointState = BaseFeature &
  ChildFeature & {
    type: FeatureType.POINT;
    googleId: string;
    point: Point;
  };

export type QuizBuilderState = {
  searchResult: ChildFeature | null;
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
        feature: ParentFeature;
        childFeature: ChildFeature;
        featureId?: never;
      }
    | {
        type: AllFeaturesDispatchType.ADD_CHILD;
        featureId: string;
        childFeature: ChildFeature;
        feature?: never;
      }
  );

type SetChildren = BaseAllFeaturesDispatch &
  (
    | {
        type: AllFeaturesDispatchType.SET_CHILDREN;
        feature: ParentFeature;
        childIds: string[];
        featureId?: never;
      }
    | {
        type: AllFeaturesDispatchType.SET_CHILDREN;
        featureId: string;
        childIds: string[];
        feature?: never;
      }
  );

type Rename = BaseAllFeaturesDispatch &
  (
    | {
        type: AllFeaturesDispatchType.RENAME;
        feature: ChildFeature;
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
        feature: ChildFeature;
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
  feature: ChildFeature | null;
};

type SetSelected = BaseQuizBuilderDispatch &
  (
    | {
        type: QuizBuilderDispatchType.SET_SELECTED;
        feature: ChildFeature | null;
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
        lastFeature: ParentFeature | null;
        feature: ParentFeature;
        featureId?: never;
      }
    | {
        type: QuizBuilderDispatchType.SET_ADDING;
        lastFeature: ParentFeature | null;
        featureId: string;
        feature?: never;
      }
  );

type SetIsOpen = BaseQuizBuilderDispatch &
  (
    | {
        type: QuizBuilderDispatchType.SET_IS_OPEN;
        feature: ChildFeature;
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
        feature: ChildFeature;
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
        feature: ChildFeature;
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
        feature: ChildFeature;
        featureId?: never;
      }
    | {
        type: QuizTakerDispatchType.MARK_INCORRECT;
        featureId: string;
        feature?: never;
      }
  );
