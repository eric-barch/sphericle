"use client";

import { useAllFeatures } from "@/components/all-features-provider";
import { isAreaState, isPointState, isSubfeatureState } from "@/helpers/state";
import { AllFeaturesDispatchType, ParentFeatureState } from "@/types";
import { Reorder } from "framer-motion";
import { Area } from "./area";
import { FeatureAdder } from "./feature-adder";
import { Point } from "./point";

type SubfeaturesProps = {
  featureAdderInputRef: React.RefObject<HTMLInputElement>;
  className?: string;
  featureState: ParentFeatureState;
  isAdding: boolean;
};

function Subfeatures({
  featureAdderInputRef,
  className,
  featureState,
  isAdding,
}: SubfeaturesProps) {
  const { featureId, subfeatureIds: subfeatureIdsRaw } = featureState;

  const { allFeaturesDispatch } = useAllFeatures();

  const subfeatureIds = Array.from(subfeatureIdsRaw);

  const handleReorder = (subfeatureIds: string[]) => {
    allFeaturesDispatch({
      dispatchType: AllFeaturesDispatchType.SET_SUBFEATURES,
      featureId,
      subfeatureIds,
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
}

interface SubfeatureProps {
  featureId: string;
}

function Subfeature({ featureId }: SubfeatureProps) {
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
}

export { Subfeatures };
