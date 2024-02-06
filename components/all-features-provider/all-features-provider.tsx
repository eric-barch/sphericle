"use client";

import { isParentFeatureState, isSubfeatureState } from "@/helpers/type-guards";
import {
  AllFeatures,
  AllFeaturesDispatch,
  AllFeaturesDispatchType,
  AreaState,
  FeatureType,
  PointState,
  RootState,
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

function AllFeaturesProvider({ children }: { children: ReactNode }) {
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

function useAllFeatures(): {
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
  switch (action.dispatchType) {
    case AllFeaturesDispatchType.ADD_SUBFEATURE: {
      const { subfeatureState } = action;

      const featureId = action.featureId || action.featureState.featureId;
      const subfeatureId = subfeatureState.featureId;

      const newAllFeatures = new Map(allFeatures);
      const newFeatureState = newAllFeatures.get(featureId);

      if (!isParentFeatureState(newFeatureState)) {
        throw new Error("newFeatureState must be a ParentFeatureState.");
      }

      newFeatureState.subfeatureIds.add(subfeatureId);

      newAllFeatures.set(featureId, newFeatureState);
      newAllFeatures.set(subfeatureId, subfeatureState);

      return newAllFeatures;
    }
    case AllFeaturesDispatchType.SET_SUBFEATURES: {
      const { subfeatureIds } = action;

      const featureId = action.featureId || action.featureState.featureId;

      const newAllFeatures = new Map(allFeatures);
      const newFeatureState = newAllFeatures.get(featureId);

      if (!isParentFeatureState(newFeatureState)) {
        throw new Error("newFeatureState must be a ParentFeatureState.");
      }

      newFeatureState.subfeatureIds = new Set(subfeatureIds);

      return newAllFeatures;
    }
    case AllFeaturesDispatchType.RENAME: {
      const { name } = action;

      const featureId = action.featureId || action.featureState.featureId;

      const newAllFeatures = new Map(allFeatures);
      const newFeatureState = newAllFeatures.get(featureId);

      if (!isSubfeatureState(newFeatureState)) {
        throw new Error("newFeatureState must be a SubfeatureState.");
      }

      newFeatureState.userDefinedName = name;

      return newAllFeatures;
    }
    case AllFeaturesDispatchType.DELETE: {
      const featureId = action.featureId || action.featureState.featureId;

      const newAllFeatures = new Map(allFeatures);
      const newFeatureState = newAllFeatures.get(featureId);

      if (!isSubfeatureState(newFeatureState)) {
        throw new Error("newFeatureState must be a SubfeatureState.");
      }

      const newParentFeature = newAllFeatures.get(
        newFeatureState.parentFeatureId,
      );

      if (!isParentFeatureState(newParentFeature)) {
        throw new Error("newParentFeature must be a ParentFeatureState.");
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
      featureId: rootId,
      subfeatureIds: new Set<string>(),
      featureType: FeatureType.ROOT,
    },
  ],
]);

export { AllFeaturesProvider, useAllFeatures };
