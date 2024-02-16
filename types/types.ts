import { AllGeoJSON } from "@turf/helpers";
import { MultiPolygon, Point, Polygon } from "geojson";
import {
  FeatureType,
  QuizBuilderDispatchType,
  QuizDispatchType,
  QuizTakerDispatchType,
  SearchStatus,
} from "./enums";

type BaseFeature = {
  id: string;
  type: FeatureType;
};

type BaseParentFeature = BaseFeature & {
  childIds: Set<string>;
};

type BaseChildFeature = BaseFeature & {
  parentId: string;
  longName: string;
  shortName: string;
  userDefinedName: string | null;
  displayBounds: google.maps.LatLngBoundsLiteral;
};

export type EarthState = BaseFeature &
  BaseParentFeature & {
    type: FeatureType.EARTH;
  };

export type AreaState = BaseFeature &
  BaseParentFeature &
  BaseChildFeature & {
    type: FeatureType.AREA;
    osmId: number;
    searchBounds: google.maps.LatLngBoundsLiteral;
    polygon: Polygon | MultiPolygon;
  };

export type PointState = BaseFeature &
  BaseChildFeature & {
    type: FeatureType.POINT;
    googleId: string;
    point: Point;
  };

export type Feature = EarthState | AreaState | PointState;
export type ParentFeature = EarthState | AreaState;
export type ChildFeature = AreaState | PointState;

type BaseQuizDispatch = {
  type: QuizDispatchType;
};

type AddChild = BaseQuizDispatch &
  (
    | {
        type: QuizDispatchType.ADD_CHILD;
        parent: ParentFeature;
        child: ChildFeature;
        parentId?: never;
      }
    | {
        type: QuizDispatchType.ADD_CHILD;
        parentId: string;
        child: ChildFeature;
        parent?: never;
      }
  );

type SetChildren = BaseQuizDispatch &
  (
    | {
        type: QuizDispatchType.SET_CHILDREN;
        parent: ParentFeature;
        childIds: string[];
        parentId?: never;
      }
    | {
        type: QuizDispatchType.SET_CHILDREN;
        parentId: string;
        childIds: string[];
        parent?: never;
      }
  );

type Rename = BaseQuizDispatch &
  (
    | {
        type: QuizDispatchType.RENAME;
        feature: ChildFeature;
        name: string;
        featureId?: never;
      }
    | {
        type: QuizDispatchType.RENAME;
        featureId: string;
        name: string;
        feature?: never;
      }
  );

type Delete = BaseQuizDispatch &
  (
    | {
        type: QuizDispatchType.DELETE;
        feature: ChildFeature;
        featureId?: never;
      }
    | {
        type: QuizDispatchType.DELETE;
        featureId: string;
        feature?: never;
      }
  );

export type QuizState = Map<string, Feature>;

export type QuizDispatch = AddChild | SetChildren | Rename | Delete;

type BaseQuizBuilderDispatch = {
  type: QuizBuilderDispatchType;
};

type SetSearchOption = BaseQuizBuilderDispatch & {
  type: QuizBuilderDispatchType.SET_SEARCH_OPTION;
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
        lastAdding: ParentFeature | null;
        feature: ParentFeature;
        featureId?: never;
      }
    | {
        type: QuizBuilderDispatchType.SET_ADDING;
        lastAdding: ParentFeature | null;
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

export type QuizBuilderState = {
  searchResult: ChildFeature | null;
  selectedId: string | null;
  addingId: string | null;
  renamingId: string | null;
  openIds: Set<string>;
};

export type QuizBuilderDispatch =
  | SetSearchOption
  | SetSelected
  | SetAdding
  | SetRenaming
  | SetIsOpen;

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

export type QuizTakerState = {
  currentId: string;
  correctIds: Set<string>;
  incorrectIds: Set<string>;
  remainingIds: Set<string>;
};

export type QuizTakerDispatch = Reset | MarkCorrect | MarkIncorrect;

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
