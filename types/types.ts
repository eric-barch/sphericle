import { MultiPolygon, Point, Polygon } from "geojson";
import { LocationType } from "./enums";

export interface Quiz {
  locations: {
    [key: string]: RootState | AreaState | PointState;
  };
  selectedBuilderLocationId: string | null;
  selectedTakerLocationId: string | null;
}

export interface RootState {
  id: string;
  sublocationIds: string[];
  shortName: string;
  locationType: LocationType.ROOT;
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
  bounds: google.maps.LatLngBoundsLiteral;
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
  isAdding: boolean;
  bounds: google.maps.LatLngBoundsLiteral;
  point: Point;
  answerCorrectly: boolean | null;
}
