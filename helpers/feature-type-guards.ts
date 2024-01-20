import { AreaState, FeatureType, PointState, RootState } from "@/types";

export function isParentFeature(
  feature: RootState | AreaState | PointState,
): feature is RootState | AreaState {
  return (
    feature.featureType === FeatureType.ROOT ||
    feature.featureType === FeatureType.AREA
  );
}

export function isQuizzableFeature(
  feature: RootState | AreaState | PointState,
): feature is AreaState | PointState {
  return (
    feature.featureType === FeatureType.AREA ||
    feature.featureType === FeatureType.POINT
  );
}
