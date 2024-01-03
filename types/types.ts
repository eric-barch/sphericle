import { AllGeoJSON } from "@turf/helpers";
import { MultiPolygon, Point, Polygon } from "geojson";
import { LocationType, QuizDispatchType } from "./enums";

export interface Quiz {
  rootId: string;
  locations: {
    [key: string]: RootState | AreaState | PointState;
  };
  activeOption: AreaState | PointState | null;
  builderSelectedId: string | null;
  takerSelectedId: string | null;
  incorrectLocations: number;
  correctLocations: number;
  totalLocations: number;
  isComplete: boolean;
}

export interface RootState {
  id: string;
  sublocationIds: string[];
  shortName: string;
  locationType: LocationType.ROOT;
  isAdding: true;
}

export interface AreaState {
  id: string;
  parentId: string;
  sublocationIds: string[];
  openStreetMapPlaceId: number;
  longName: string;
  shortName: string;
  userDefinedName: string | null;
  locationType: LocationType.AREA;
  isOpen: boolean;
  isAdding: boolean;
  searchBounds: google.maps.LatLngBoundsLiteral;
  displayBounds: google.maps.LatLngBoundsLiteral;
  polygons: Polygon | MultiPolygon;
  answeredCorrectly: boolean | null;
}

export interface PointState {
  id: string;
  parentId: string;
  googlePlacesId: string;
  longName: string;
  shortName: string;
  userDefinedName: string | null;
  locationType: LocationType.POINT;
  displayBounds: google.maps.LatLngBoundsLiteral;
  point: Point;
  answeredCorrectly: boolean | null;
}

export type QuizDispatch =
  | AddSublocationDispatch
  | SetSublocationsDispatch
  | RenameLocationDispatch
  | SetAreaIsOpenDispatch
  | SetAreaIsAddingDispatch
  | SetBuilderSelectedDispatch
  | ResetTakerDispatch
  | MarkTakerSelectedDispatch
  | SelectOptionDispatch
  | DeleteLocationDispatch;

interface BaseQuizDispatch {
  type: QuizDispatchType;
}

interface AddSublocationDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.ADD_SUBLOCATION;
  parentId: string;
  sublocation: AreaState | PointState;
}

interface SetSublocationsDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.SET_SUBLOCATION_IDS;
  locationId: string;
  sublocationIds: string[];
}

interface RenameLocationDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.RENAME_LOCATION;
  locationId: string;
  name: string;
}

interface SetAreaIsOpenDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.SET_AREA_IS_OPEN;
  locationId: string;
  isOpen: boolean;
}

interface SetAreaIsAddingDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.SET_AREA_IS_ADDING;
  locationId: string;
  isAdding: boolean;
}

interface SetBuilderSelectedDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.SET_BUILDER_SELECTED;
  locationId: string | null;
}

interface ResetTakerDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.RESET_TAKER;
}

interface MarkTakerSelectedDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.MARK_TAKER_SELECTED;
  answeredCorrectly: boolean;
}

interface SelectOptionDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.SELECT_OPTION;
  location: AreaState | PointState;
}

interface DeleteLocationDispatch extends BaseQuizDispatch {
  type: QuizDispatchType.DELETE_LOCATION;
  locationId: string;
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
