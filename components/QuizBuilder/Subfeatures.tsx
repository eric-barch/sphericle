"use client";

import { useAllFeatures } from "@/components/AllFeaturesProvider";
import {
  isAreaState,
  isParentFeatureState,
  isPointState,
  isSubfeatureState,
} from "@/helpers/feature-type-guards";
import { AllFeaturesDispatchType } from "@/types";
import { Reorder } from "framer-motion";
import { RefObject } from "react";
import Area from "./Area";
import FeatureAdder from "./FeatureAdder";
import Point from "./Point";

interface SubfeaturesProps {
  featureAdderInputRef?: RefObject<HTMLInputElement>;
  className?: string;
  parentFeatureId: string;
}

export default function Subfeatures({
  featureAdderInputRef,
  className,
  parentFeatureId,
}: SubfeaturesProps) {
  const { allFeatures, allFeaturesDispatch } = useAllFeatures();

  const parentFeature = allFeatures.get(parentFeatureId);

  if (!isParentFeatureState(parentFeature)) {
    throw new Error("parentFeature must be ParentFeatureState.");
  }

  function handleReorder(subfeatureIds: string[]) {
    allFeaturesDispatch({
      type: AllFeaturesDispatchType.SET_SUBFEATURES,
      parentFeature: parentFeatureId,
      subfeatureIds,
    });
  }

  return (
    <div className={`${className} space-y-1 h-full`}>
      <Reorder.Group
        className="mt-1 space-y-1"
        axis="y"
        values={Array.from(parentFeature.subfeatureIds)}
        onReorder={handleReorder}
      >
        {Array.from(parentFeature.subfeatureIds).map((subfeatureId) => (
          <Reorder.Item
            key={subfeatureId}
            layout="position"
            layoutScroll
            value={subfeatureId}
            transition={{ duration: 0 }}
          >
            <Subfeature subfeatureId={subfeatureId} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <FeatureAdder
        inputRef={featureAdderInputRef}
        featureId={parentFeatureId}
      />
    </div>
  );
}

interface SubfeatureProps {
  subfeatureId: string;
}

function Subfeature({ subfeatureId }: SubfeatureProps) {
  const { allFeatures } = useAllFeatures();

  const subfeature = allFeatures.get(subfeatureId);

  if (!isSubfeatureState(subfeature)) {
    throw new Error("subfeature must be a SubfeatureState.");
  }

  if (isAreaState(subfeature)) {
    return <Area featureId={subfeatureId} />;
  }

  if (isPointState(subfeature)) {
    return <Point featureId={subfeatureId} />;
  }
}
