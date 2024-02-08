"use client";

import { isArea, isPoint, isChild } from "@/helpers";
import { useAllFeatures } from "@/providers";
import { AllFeaturesDispatchType, ParentFeature } from "@/types";
import { Reorder } from "framer-motion";
import { Area } from "./area";
import { FeatureAdder } from "./feature-adder";
import { Point } from "./point";

type ChildFeatureProps = {
  featureAdderInputRef: React.RefObject<HTMLInputElement>;
  className?: string;
  parent: ParentFeature;
  isAdding: boolean;
};

const ChildFeatures = ({
  featureAdderInputRef,
  className,
  parent,
  isAdding,
}: ChildFeatureProps) => {
  const { id: featureId, childIds: subfeatureIdsRaw } = parent;

  const { allFeaturesDispatch } = useAllFeatures();

  const subfeatureIds = Array.from(subfeatureIdsRaw);

  const handleReorder = (subfeatureIds: string[]) => {
    allFeaturesDispatch({
      type: AllFeaturesDispatchType.SET_CHILDREN,
      featureId,
      childFeatureIds: subfeatureIds,
    });
  };

  return (
    <div className={`${className} space-y-1 h-full`}>
      <Reorder.Group
        className="mt-1 space-y-1"
        axis="y"
        values={subfeatureIds}
        onReorder={handleReorder}
      >
        {subfeatureIds.map((subfeatureId) => (
          // TODO: Fix animation
          <Reorder.Item
            key={subfeatureId}
            layout="position"
            layoutScroll
            value={subfeatureId}
            transition={{ duration: 0 }}
          >
            <Subfeature featureId={subfeatureId} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      {isAdding && (
        <FeatureAdder inputRef={featureAdderInputRef} featureState={parent} />
      )}
    </div>
  );
};

type SubfeatureProps = {
  featureId: string;
};

const Subfeature = ({ featureId }: SubfeatureProps) => {
  const { allFeatures } = useAllFeatures();

  const featureState = (() => {
    const featureState = allFeatures.get(featureId);

    if (isChild(featureState)) {
      return featureState;
    }
  })();

  if (isArea(featureState)) {
    return <Area areaState={featureState} />;
  }

  if (isPoint(featureState)) {
    return <Point pointState={featureState} />;
  }
};

export { ChildFeatures };
