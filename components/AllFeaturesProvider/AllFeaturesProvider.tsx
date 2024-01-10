"use client";

import {
  FeatureType,
  AllFeatures,
  AllFeaturesDispatch,
  AllFeaturesDispatchType,
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

export const rootId = crypto.randomUUID();

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

      const newAllFeatures = { ...allFeatures };
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

      const newAllFeatures = { ...allFeatures };
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

      const newAllFeatures = { ...allFeatures };
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
    case AllFeaturesDispatchType.SET_AREA_IS_OPEN: {
      const newAllFeatures = { ...allFeatures };
      const newLocation = newAllFeatures.features[action.featureId];

      if (newLocation.featureType !== FeatureType.AREA) {
        throw new Error("newLocation must be of type AREA.");
      }

      newLocation.isOpen = action.isOpen;

      if (!action.isOpen) {
        newLocation.isAdding = false;
      }

      return newAllFeatures;
    }
    case AllFeaturesDispatchType.SET_AREA_IS_ADDING: {
      const newAllFeatures = { ...allFeatures };
      const newLocation = newAllFeatures.features[action.featureId];

      if (newLocation.featureType !== FeatureType.AREA) {
        throw new Error("newLocation must be of type AREA.");
      }

      newLocation.isAdding = action.isAdding;

      if (action.isAdding) {
        newLocation.isOpen = true;
      }

      return newAllFeatures;
    }
    case AllFeaturesDispatchType.DELETE_FEATURE: {
      const newAllFeatures = { ...allFeatures };

      if (!newAllFeatures.features[action.featureId]) {
        return newAllFeatures;
      }

      const newLocation = newAllFeatures.features[action.featureId];

      if (
        newLocation.featureType !== FeatureType.AREA &&
        newLocation.featureType !== FeatureType.POINT
      ) {
        throw new Error("newLocation must be of type AREA or POINT.");
      }

      const newParent = newAllFeatures.features[newLocation.parentId];

      if (
        newParent.featureType !== FeatureType.ROOT &&
        newParent.featureType !== FeatureType.AREA
      ) {
        throw new Error("newParent must be of type ROOT or AREA.");
      }

      newParent.subfeatureIds = newParent.subfeatureIds.filter(
        (sublocationId) => sublocationId !== action.featureId,
      );

      delete newAllFeatures.features[action.featureId];

      return getResetAllFeatures(newAllFeatures);
    }
    default: {
      return { ...allFeatures };
    }
  }
}

const initialAllFeatures: AllFeatures = {
  rootId,
  features: {
    [rootId]: {
      id: rootId,
      subfeatureIds: [],
      featureType: FeatureType.ROOT,
    },
  },
};
