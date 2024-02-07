import {
  AreaState,
  BaseFeatureState,
  FeatureType,
  ParentFeatureState,
  PointState,
  RootState,
  SubfeatureState,
} from "@/types";
import { AllGeoJSON } from "@turf/helpers";
import { MultiPolygon, Polygon } from "geojson";

function isParentFeatureState(
  featureState: BaseFeatureState,
): featureState is ParentFeatureState {
  return (
    featureState &&
    (featureState.featureType === FeatureType.ROOT ||
      featureState.featureType === FeatureType.AREA)
  );
}

function isSubfeatureState(
  featureState: BaseFeatureState,
): featureState is SubfeatureState {
  return (
    featureState &&
    (featureState.featureType === FeatureType.AREA ||
      featureState.featureType === FeatureType.POINT)
  );
}

function isRootState(
  featureState: BaseFeatureState,
): featureState is RootState {
  return featureState && featureState.featureType === FeatureType.ROOT;
}

function isAreaState(
  featureState: BaseFeatureState,
): featureState is AreaState {
  return featureState && featureState.featureType === FeatureType.AREA;
}

function isPointState(
  featureState: BaseFeatureState,
): featureState is PointState {
  return featureState && featureState.featureType === FeatureType.POINT;
}

export {
  isAreaState,
  isParentFeatureState,
  isPointState,
  isRootState,
  isSubfeatureState,
};
