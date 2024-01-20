import {
  AreaState,
  FeatureState,
  FeatureType,
  ParentFeatureState,
  PointState,
  RootState,
  SubfeatureState,
} from "@/types";

export function isParentFeature(
  feature: FeatureState,
): feature is ParentFeatureState {
  return (
    feature.featureType === FeatureType.ROOT ||
    feature.featureType === FeatureType.AREA
  );
}

export function isSubfeature(
  feature: FeatureState,
): feature is SubfeatureState {
  return (
    feature.featureType === FeatureType.AREA ||
    feature.featureType === FeatureType.POINT
  );
}
