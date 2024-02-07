"use client";

import { isParentFeatureState, isSubfeatureState } from "@/helpers/state";
import {
  AllFeatures,
  AllFeaturesDispatch,
  AllFeaturesDispatchType,
  FeatureState,
  FeatureType,
} from "@/types";
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";

const AllFeaturesContext = createContext<AllFeatures>(null);
const AllFeaturesDispatchContext =
  createContext<Dispatch<AllFeaturesDispatch>>(null);

const rootId = crypto.randomUUID();

type AllFeaturesProviderProps = {
  children: ReactNode;
};

const AllFeaturesProvider = ({ children }: AllFeaturesProviderProps) => {
  const allFeaturesReducer = (
    allFeatures: AllFeatures,
    action: AllFeaturesDispatch,
  ): AllFeatures => {
    switch (action.dispatchType) {
      case AllFeaturesDispatchType.ADD_SUBFEATURE: {
        const newAllFeatures = new Map(allFeatures);
        const featureId = action.featureId || action.featureState.featureId;
        const { subfeatureState } = action;
        const subfeatureId = subfeatureState.featureId;
        const newFeatureState = newAllFeatures.get(featureId);

        if (!isParentFeatureState(newFeatureState)) {
          console.error("newFeatureState must be a ParentFeatureState.");
          return;
        }

        newFeatureState.subfeatureIds.add(subfeatureId);
        newAllFeatures.set(featureId, newFeatureState);
        newAllFeatures.set(subfeatureId, subfeatureState);

        return newAllFeatures;
      }
      case AllFeaturesDispatchType.SET_SUBFEATURES: {
        const newAllFeatures = new Map(allFeatures);
        const featureId = action.featureId || action.featureState.featureId;
        const { subfeatureIds } = action;
        const newFeatureState = newAllFeatures.get(featureId);

        if (!isParentFeatureState(newFeatureState)) {
          console.error("newFeatureState must be a ParentFeatureState.");
          return;
        }

        newFeatureState.subfeatureIds = new Set(subfeatureIds);

        return newAllFeatures;
      }
      case AllFeaturesDispatchType.RENAME: {
        const newAllFeatures = new Map(allFeatures);
        const featureId = action.featureId || action.featureState.featureId;
        const { name } = action;
        const newFeatureState = newAllFeatures.get(featureId);

        if (!isSubfeatureState(newFeatureState)) {
          console.error("newFeatureState must be a SubfeatureState.");
          return;
        }

        newFeatureState.userDefinedName = name;

        return newAllFeatures;
      }
      case AllFeaturesDispatchType.DELETE: {
        const newAllFeatures = new Map(allFeatures);
        const featureId = action.featureId || action.featureState.featureId;
        const newFeatureState = newAllFeatures.get(featureId);

        if (!isSubfeatureState(newFeatureState)) {
          console.error("newFeatureState must be a SubfeatureState.");
          return;
        }

        const newParentFeature = newAllFeatures.get(
          newFeatureState.parentFeatureId,
        );

        if (!isParentFeatureState(newParentFeature)) {
          console.error("newParentFeature must be a ParentFeatureState.");
          return;
        }

        newParentFeature.subfeatureIds.delete(featureId);
        newAllFeatures.delete(featureId);

        return newAllFeatures;
      }
    }
  };

  const initialAllFeatures = new Map<string, FeatureState>([
    [
      rootId,
      {
        featureId: rootId,
        subfeatureIds: new Set<string>(),
        featureType: FeatureType.ROOT,
      },
    ],
  ]);

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
};

const useAllFeatures = (): {
  rootId: string;
  allFeatures: AllFeatures;
  allFeaturesDispatch: Dispatch<AllFeaturesDispatch>;
} => {
  const allFeatures = useContext(AllFeaturesContext);
  const allFeaturesDispatch = useContext(AllFeaturesDispatchContext);
  return { rootId, allFeatures, allFeaturesDispatch };
};

export { AllFeaturesProvider, useAllFeatures };
