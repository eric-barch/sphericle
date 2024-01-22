"use client";

import {
  isParentFeatureState,
  isSubfeatureState,
} from "@/helpers/feature-type-guards";
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

      if (!isParentFeatureState(newParentFeature)) {
        throw new Error("newParentFeature must be a ParentFeatureState.");
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

      if (!isParentFeatureState(newParentFeature)) {
        throw new Error("newParentFeature must be a ParentFeatureState.");
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

      if (!isSubfeatureState(newFeature)) {
        throw new Error("newFeature must be a SubfeatureState.");
      }

      newFeature.userDefinedName = name;

      return newAllFeatures;
    }
    case AllFeaturesDispatchType.DELETE_FEATURE: {
      const { featureId } = action;

      const newAllFeatures = new Map(allFeatures);
      const newFeature = newAllFeatures.get(featureId);

      if (!isSubfeatureState(newFeature)) {
        throw new Error("newFeature must be a SubfeatureState.");
      }

      const newParentFeature = newAllFeatures.get(newFeature.parentFeatureId);

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
      id: rootId,
      subfeatureIds: new Set<string>(),
      featureType: FeatureType.ROOT,
    },
  ],
]);
