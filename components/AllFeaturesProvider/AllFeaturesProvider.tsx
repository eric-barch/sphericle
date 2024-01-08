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

export function useAllFeatures(): AllFeatures {
  return useContext(AllFeaturesContext);
}

export function useAllFeaturesDispatch(): Dispatch<AllFeaturesDispatch> {
  return useContext(AllFeaturesDispatchContext);
}

function allFeaturesReducer(
  allFeatures: AllFeatures,
  action: AllFeaturesDispatch,
): AllFeatures {
  switch (action.type) {
    case AllFeaturesDispatchType.ADD_SUBFEATURE: {
      const parentId = action.subfeature.parentId;
      const sublocationId = action.subfeature.id;

      const newAllFeatures = { ...allFeatures };
      const newParent = { ...allFeatures.features[parentId] };

      if (newParent.featureType === FeatureType.POINT) {
        throw new Error("newParent must not be of type POINT.");
      }

      if (!newParent.subfeatureIds.includes(sublocationId)) {
        newParent.subfeatureIds = [...newParent.subfeatureIds, sublocationId];
        newAllFeatures.features[parentId] = newParent;
      }

      newAllFeatures.features[sublocationId] = action.subfeature;

      return getResetAllFeatures(newAllFeatures);
    }
    case AllFeaturesDispatchType.SET_SUBFEATURES: {
      const newAllFeatures = { ...allFeatures };
      const newLocation = newAllFeatures.features[action.featureId];

      if (
        newLocation.featureType !== FeatureType.ROOT &&
        newLocation.featureType !== FeatureType.AREA
      ) {
        throw new Error("newLocation must be of type ROOT or AREA.");
      }

      newLocation.subfeatureIds = action.subfeatureIds;

      return getResetAllFeatures(newAllFeatures);
    }
    case AllFeaturesDispatchType.RENAME_FEATURE: {
      const newAllFeatures = { ...allFeatures };
      const newLocation = newAllFeatures.features[action.featureId];

      if (newLocation.featureType === FeatureType.ROOT) {
        throw new Error("newLocation must not be of type ROOT.");
      }

      newLocation.userDefinedName = action.name;

      return getResetAllFeatures(newAllFeatures);
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

function getResetAllFeatures(allfeatures: AllFeatures): AllFeatures {
  const newAllFeatures = { ...allfeatures };

  // newAllFeatures.correct = 0;
  // newAllFeatures.incorrect = 0;

  // for (const location of Object.values(newAllFeatures)) {
  //   if (
  //     location.featureType === FeatureType.AREA ||
  //     location.featureType === FeatureType.POINT {
  //     location.answeredCorrectly = null;
  //   }
  // }

  // const rootLocation = newallFeatures.features[newAllFeatures.root];

  // if (rootLocation.featureType !== LocationType.ROOT) {
  //   throw new Error("rootLocation must be of type ROOT.");
  // }

  // newAllFeatures.takerSelected = rootLocation.subfeatureIds[0];
  // newAllFeatures.isComplete = false;

  return newAllFeatures;
}
