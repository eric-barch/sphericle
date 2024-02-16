import {
  AreaState,
  BaseFeature,
  ChildFeature,
  FeatureType,
  ParentFeature,
  PointState,
  EarthState,
} from "@/types";

const isParent = (feature: BaseFeature): feature is ParentFeature => {
  return (
    feature?.type === FeatureType.ROOT || feature?.type === FeatureType.AREA
  );
};

const isChild = (feature: BaseFeature): feature is ChildFeature => {
  return (
    feature?.type === FeatureType.AREA || feature?.type === FeatureType.POINT
  );
};

const isRoot = (feature: BaseFeature): feature is EarthState => {
  return feature?.type === FeatureType.ROOT;
};

const isArea = (feature: BaseFeature): feature is AreaState => {
  return feature?.type === FeatureType.AREA;
};

const isPoint = (feature: BaseFeature): feature is PointState => {
  return feature?.type === FeatureType.POINT;
};

export {
  isArea as isArea,
  isChild as isChild,
  isParent as isParent,
  isPoint as isPoint,
  isRoot as isRoot,
};
