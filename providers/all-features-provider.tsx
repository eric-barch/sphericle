"use client";

import { isParentFeatureState, isSubfeatureState } from "@/helpers";
import {
  AllFeatures,
  AllFeaturesDispatch,
  AllFeaturesDispatchType,
  Feature,
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
    switch (action.type) {
      case AllFeaturesDispatchType.ADD_CHILD: {
        const newAllFeatures = new Map(allFeatures);
        const featureId = action.featureId || action.feature.id;
        const { subfeatureState } = action;
        const subfeatureId = subfeatureState.id;
        const newFeatureState = newAllFeatures.get(featureId);

        if (!isParentFeatureState(newFeatureState)) {
          console.error("newFeatureState must be a ParentFeatureState.");
          return;
        }

        newFeatureState.childIds.add(subfeatureId);
        newAllFeatures.set(featureId, newFeatureState);
        newAllFeatures.set(subfeatureId, subfeatureState);

        return newAllFeatures;
      }
      case AllFeaturesDispatchType.SET_CHILDREN: {
        const newAllFeatures = new Map(allFeatures);
        const featureId = action.featureId || action.feature.id;
        const { subfeatureIds } = action;
        const newFeatureState = newAllFeatures.get(featureId);

        if (!isParentFeatureState(newFeatureState)) {
          console.error("newFeatureState must be a ParentFeatureState.");
          return;
        }

        newFeatureState.childIds = new Set(subfeatureIds);

        return newAllFeatures;
      }
      case AllFeaturesDispatchType.RENAME: {
        const newAllFeatures = new Map(allFeatures);
        const featureId = action.featureId || action.feature.id;
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
        const featureId = action.featureId || action.feature.id;
        const newFeatureState = newAllFeatures.get(featureId);

        if (!isSubfeatureState(newFeatureState)) {
          console.error("newFeatureState must be a SubfeatureState.");
          return;
        }

        const newParentFeature = newAllFeatures.get(newFeatureState.parentId);

        if (!isParentFeatureState(newParentFeature)) {
          console.error("newParentFeature must be a ParentFeatureState.");
          return;
        }

        newParentFeature.childIds.delete(featureId);
        newAllFeatures.delete(featureId);

        return newAllFeatures;
      }
    }
  };

  const initialAllFeatures = new Map<string, Feature>([
    [
      rootId,
      {
        id: rootId,
        childIds: new Set<string>(),
        type: FeatureType.ROOT,
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
