"use client";

import {
  FeatureType,
  AllFeatures,
  AllFeaturesDispatch,
  AllFeaturesDispatchType,
  RootState,
  AreaState,
  PointState,
} from "@/types";
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";

const AllFeaturesContext = createContext<AllFeatures | null>(null);
const AllFeaturesDispatchContext =
  createContext<Dispatch<AllFeaturesDispatch> | null>(null);

export default function AllFeaturesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [allFeatures, allFeaturesDispatch] = useReducer(
    allFeaturesReducer,
    initialAllFeatures,
  );

  return (
    <AllFeaturesContext.Provider value={allFeatures}>
      <AllFeaturesDispatchContext.Provider value={allFeaturesDispatch}>
        {children}
      </AllFeaturesDispatchContext.Provider>
    </AllFeaturesContext.Provider>
  );
}

const rootId = crypto.randomUUID();

export function useAllFeatures(): {
  rootId: string;
  allFeatures: AllFeatures;
  allFeaturesDispatch: Dispatch<AllFeaturesDispatch>;
} {
  const allFeatures = useContext(AllFeaturesContext);
  const allFeaturesDispatch = useContext(AllFeaturesDispatchContext);
  return { rootId, allFeatures, allFeaturesDispatch };
}

function allFeaturesReducer(
  allFeatures: AllFeatures,
  action: AllFeaturesDispatch,
): AllFeatures {
  switch (action.type) {
    case AllFeaturesDispatchType.ADD_SUBFEATURE: {
      const { parentFeatureId, subfeature } = action;

      const newAllFeatures = new Map(allFeatures);
      const newParentFeature = { ...allFeatures.get(parentFeatureId) };

      if (
        newParentFeature.featureType !== FeatureType.ROOT &&
        newParentFeature.featureType !== FeatureType.AREA
      ) {
        throw new Error("newParentFeature must be of type ROOT or AREA.");
      }

      newParentFeature.subfeatureIds.add(subfeature.id);

      newAllFeatures.set(parentFeatureId, newParentFeature);
      newAllFeatures.set(subfeature.id, subfeature);

      return newAllFeatures;
    }
    case AllFeaturesDispatchType.SET_SUBFEATURES: {
      const { parentFeatureId, subfeatureIds } = action;

      const newAllFeatures = new Map(allFeatures);
      const newParentFeature = newAllFeatures.get(parentFeatureId);

      if (
        newParentFeature.featureType !== FeatureType.ROOT &&
        newParentFeature.featureType !== FeatureType.AREA
      ) {
        throw new Error("newParentFeature must be of type ROOT or AREA.");
      }

      subfeatureIds.forEach((element) => {
        newParentFeature.subfeatureIds.add(element);
      });

      return newAllFeatures;
    }
    case AllFeaturesDispatchType.RENAME_FEATURE: {
      const { featureId, name } = action;

      const newAllFeatures = new Map(allFeatures);
      const newFeature = newAllFeatures.get(featureId);

      if (
        newFeature.featureType !== FeatureType.AREA &&
        newFeature.featureType !== FeatureType.POINT
      ) {
        throw new Error("newFeature must be of type ROOT or AREA.");
      }

      newFeature.userDefinedName = name;

      return newAllFeatures;
    }
    // TODO: Intuitively this seems like it should be part of QuizBuilder state, not AllFeatures
    case AllFeaturesDispatchType.SET_AREA_IS_OPEN: {
      const { featureId, isOpen } = action;

      const newAllFeatures = new Map(allFeatures);
      const newFeature = newAllFeatures.get(featureId);

      if (newFeature.featureType !== FeatureType.AREA) {
        throw new Error("newFeature must be of type AREA.");
      }

      newFeature.isOpen = isOpen;

      if (isOpen) {
        newFeature.isAdding = false;
      }

      return newAllFeatures;
    }
    // TODO: Intuitively this seems like it should be part of QuizBuilder state, not AllFeatures
    case AllFeaturesDispatchType.SET_AREA_IS_ADDING: {
      const { featureId, isAdding } = action;

      const newAllFeatures = new Map(allFeatures);
      const newFeature = newAllFeatures.get(featureId);

      if (newFeature.featureType !== FeatureType.AREA) {
        throw new Error("newFeature must be of type AREA.");
      }

      newFeature.isAdding = isAdding;

      if (isAdding) {
        newFeature.isOpen = true;
      }

      return newAllFeatures;
    }
    case AllFeaturesDispatchType.DELETE_FEATURE: {
      const { featureId } = action;

      const newAllFeatures = new Map(allFeatures);
      const newFeature = newAllFeatures.get(featureId);

      if (
        newFeature.featureType !== FeatureType.AREA &&
        newFeature.featureType !== FeatureType.POINT
      ) {
        throw new Error("newFeature must be of type AREA or POINT.");
      }

      const newParentFeature = newAllFeatures.get(newFeature.parentFeatureId);

      if (
        newParentFeature.featureType !== FeatureType.ROOT &&
        newParentFeature.featureType !== FeatureType.AREA
      ) {
        throw new Error("newParentFeature must be of type ROOT or AREA.");
      }

      newParentFeature.subfeatureIds.delete(featureId);
      newAllFeatures.delete(featureId);

      return newAllFeatures;
    }
    default: {
      return { ...allFeatures };
    }
  }
}

const initialAllFeatures = new Map<string, RootState | AreaState | PointState>([
  [
    rootId,
    {
      id: rootId,
      subfeatureIds: new Set<string>(),
      featureType: FeatureType.ROOT,
    },
  ],
]);
