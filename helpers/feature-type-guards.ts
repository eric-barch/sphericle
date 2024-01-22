import {
  AreaState,
  FeatureState,
  FeatureType,
  ParentFeatureState,
  PointState,
  RootState,
  SubfeatureState,
} from "@/types";

export function isParentFeatureState(
  featureState: FeatureState,
): featureState is ParentFeatureState {
  return (
    featureState.featureType === FeatureType.ROOT ||
    featureState.featureType === FeatureType.AREA
  );
}

export function isSubfeatureState(
  featureState: FeatureState,
): featureState is SubfeatureState {
  return (
    featureState.featureType === FeatureType.AREA ||
    featureState.featureType === FeatureType.POINT
  );
}

export function isRootState(
  featureState: FeatureState,
): featureState is RootState {
  return featureState.featureType === FeatureType.ROOT;
}

export function isAreaState(
  featureState: FeatureState,
): featureState is AreaState {
  return featureState.featureType === FeatureType.AREA;
}

export function isPointState(
  featureState: FeatureState,
): featureState is PointState {
  return featureState.featureType === FeatureType.POINT;
}
