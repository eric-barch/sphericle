import {
  AreaState,
  FeatureType,
  PointState,
  EarthState,
  Feature,
  ParentFeature,
  ChildFeature,
} from "@/types";

const isParent = (feature: Feature): feature is ParentFeature => {
  return (
    feature?.type === FeatureType.EARTH || feature?.type === FeatureType.AREA
  );
};

const isChild = (feature: Feature): feature is ChildFeature => {
  return (
    feature?.type === FeatureType.AREA || feature?.type === FeatureType.POINT
  );
};

const isEarth = (feature: Feature): feature is EarthState => {
  return feature?.type === FeatureType.EARTH;
};

const isArea = (feature: Feature): feature is AreaState => {
  return feature?.type === FeatureType.AREA;
};

const isPoint = (feature: Feature): feature is PointState => {
  return feature?.type === FeatureType.POINT;
};

export { isArea, isChild, isParent, isPoint, isEarth };
