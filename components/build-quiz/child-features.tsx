"use client";

import { isArea, isChild, isPoint } from "@/helpers";
import { cn } from "@/lib/utils";
import { useAllFeatures } from "@/providers";
import { AllFeaturesDispatchType, ParentFeature } from "@/types";
import { Reorder } from "framer-motion";
import { RefObject, useMemo } from "react";
import { Area } from "./area";
import { FeatureAdder } from "./feature-adder";
import { Point } from "./point";

type ChildFeaturesProps = {
  className?: string;
  parent: ParentFeature;
  isAdding: boolean;
  featureAdderInputRef: RefObject<HTMLInputElement>;
};

const ChildFeatures = (props: ChildFeaturesProps) => {
  const { className, parent, isAdding, featureAdderInputRef } = props;

  const { allFeaturesDispatch } = useAllFeatures();
  const handleReorder = (childIds: string[]) => {
    allFeaturesDispatch({
      type: AllFeaturesDispatchType.SET_CHILDREN,
      featureId: parent.id,
      childIds,
    });
  };

  return (
    <div className={className + " space-y-1 h-full"}>
      <Reorder.Group
        className="mt-1 space-y-1"
        axis="y"
        values={Array.from(parent.childIds)}
        onReorder={handleReorder}
      >
        {Array.from(parent.childIds).map((childId) => (
          <Reorder.Item
            key={childId}
            layout="position"
            layoutScroll
            value={childId}
            /**TODO: Fix animation and delete this prop. */
            transition={{ duration: 0 }}
          >
            <ChildFeature featureId={childId} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      {isAdding && (
        <FeatureAdder inputRef={featureAdderInputRef} featureState={parent} />
      )}
    </div>
  );
};
ChildFeatures.displayName = "ChildFeatures";

type ChildFeatureProps = {
  featureId: string;
};

const ChildFeature = (props: ChildFeatureProps) => {
  const { featureId } = props;

  const { allFeatures } = useAllFeatures();

  const featureState = useMemo(() => {
    const featureState = allFeatures.get(featureId);
    if (isChild(featureState)) return featureState;
  }, [allFeatures, featureId]);

  if (isArea(featureState)) {
    return <Area areaState={featureState} />;
  }

  if (isPoint(featureState)) {
    return <Point pointState={featureState} />;
  }
};

export { ChildFeatures };
