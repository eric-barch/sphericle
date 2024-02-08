"use client";

import { isAreaState, isPointState, isSubfeatureState } from "@/helpers";
import { useAllFeatures } from "@/providers";
import { AllFeaturesDispatchType, ParentFeature } from "@/types";
import { Reorder } from "framer-motion";
import { Area } from "./area";
import { FeatureAdder } from "./feature-adder";
import { Point } from "./point";

type SubfeaturesProps = {
  featureAdderInputRef: React.RefObject<HTMLInputElement>;
  className?: string;
  featureState: ParentFeature;
  isAdding: boolean;
};

const Subfeatures = ({
  featureAdderInputRef,
  className,
  featureState,
  isAdding,
}: SubfeaturesProps) => {
  const { id: featureId, childIds: subfeatureIdsRaw } = featureState;

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
        <FeatureAdder
          inputRef={featureAdderInputRef}
          featureState={featureState}
        />
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

    if (isSubfeatureState(featureState)) {
      return featureState;
    }
  })();

  if (isAreaState(featureState)) {
    return <Area areaState={featureState} />;
  }

  if (isPointState(featureState)) {
    return <Point pointState={featureState} />;
  }
};

export { Subfeatures };
