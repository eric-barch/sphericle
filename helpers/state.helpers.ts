import {
  AreaState,
  BaseFeature,
  FeatureType,
  ParentFeature,
  PointState,
  Root,
  ChildFeature,
} from "@/types";

const isParentFeatureState = (
  featureState: BaseFeature,
): featureState is ParentFeature => {
  return (
    featureState &&
    (featureState.type === FeatureType.ROOT ||
      featureState.type === FeatureType.AREA)
  );
};

const isSubfeatureState = (
  featureState: BaseFeature,
): featureState is ChildFeature => {
  return (
    featureState &&
    (featureState.type === FeatureType.AREA ||
      featureState.type === FeatureType.POINT)
  );
};

const isRootState = (featureState: BaseFeature): featureState is Root => {
  return featureState && featureState.type === FeatureType.ROOT;
};

const isAreaState = (featureState: BaseFeature): featureState is AreaState => {
  return featureState && featureState.type === FeatureType.AREA;
};

const isPointState = (
  featureState: BaseFeature,
): featureState is PointState => {
  return featureState && featureState.type === FeatureType.POINT;
};

export {
  isAreaState,
  isParentFeatureState,
  isPointState,
  isRootState,
  isSubfeatureState,
};
