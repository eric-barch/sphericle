import {
  AreaState,
  FeatureState,
  FeatureType,
  ParentFeatureState,
  PointState,
  RootState,
  SubfeatureState,
} from "@/types";
import { AllGeoJSON } from "@turf/helpers";
import { MultiPolygon, Polygon } from "geojson";

function isParentFeatureState(
  featureState: FeatureState,
): featureState is ParentFeatureState {
  return (
    featureState &&
    (featureState.featureType === FeatureType.ROOT ||
      featureState.featureType === FeatureType.AREA)
  );
}

function isSubfeatureState(
  featureState: FeatureState,
): featureState is SubfeatureState {
  return (
    featureState &&
    (featureState.featureType === FeatureType.AREA ||
      featureState.featureType === FeatureType.POINT)
  );
}

function isRootState(featureState: FeatureState): featureState is RootState {
  return featureState && featureState.featureType === FeatureType.ROOT;
}

function isAreaState(featureState: FeatureState): featureState is AreaState {
  return featureState && featureState.featureType === FeatureType.AREA;
}

function isPointState(featureState: FeatureState): featureState is PointState {
  return featureState && featureState.featureType === FeatureType.POINT;
}

function isPolygon(geoJson: AllGeoJSON): geoJson is Polygon {
  return geoJson.type === "Polygon";
}

function isMultiPolygon(geoJson: AllGeoJSON): geoJson is MultiPolygon {
  return geoJson.type === "MultiPolygon";
}

export {
  isAreaState,
  isParentFeatureState,
  isPointState,
  isRootState,
  isSubfeatureState,
};
