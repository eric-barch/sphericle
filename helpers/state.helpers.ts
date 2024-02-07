import {
  AreaState,
  BaseFeatureState,
  FeatureType,
  ParentFeatureState,
  PointState,
  RootState,
  SubfeatureState,
} from "@/types";

const isParentFeatureState = (
  featureState: BaseFeatureState,
): featureState is ParentFeatureState => {
  return (
    featureState &&
    (featureState.featureType === FeatureType.ROOT ||
      featureState.featureType === FeatureType.AREA)
  );
};

const isSubfeatureState = (
  featureState: BaseFeatureState,
): featureState is SubfeatureState => {
  return (
    featureState &&
    (featureState.featureType === FeatureType.AREA ||
      featureState.featureType === FeatureType.POINT)
  );
};

const isRootState = (
  featureState: BaseFeatureState,
): featureState is RootState => {
  return featureState && featureState.featureType === FeatureType.ROOT;
};

const isAreaState = (
  featureState: BaseFeatureState,
): featureState is AreaState => {
  return featureState && featureState.featureType === FeatureType.AREA;
};

const isPointState = (
  featureState: BaseFeatureState,
): featureState is PointState => {
  return featureState && featureState.featureType === FeatureType.POINT;
};

export {
  isAreaState,
  isParentFeatureState,
  isPointState,
  isRootState,
  isSubfeatureState,
};
