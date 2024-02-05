"use client";

import { useAllFeatures } from "@/components/all-features-provider";
import {
  isAreaState,
  isPointState,
  isSubfeatureState,
} from "@/helpers/feature-type-guards";
import { AllFeaturesDispatchType, ParentFeatureState } from "@/types";
import { Reorder } from "framer-motion";
import { Area } from "./area";
import { FeatureAdder } from "./feature-adder";
import { Point } from "./point";

type SubfeaturesProps = {
  className?: string;
  parentFeatureState: ParentFeatureState;
  isAdding: boolean;
  featureAdderInputRef: React.RefObject<HTMLInputElement>;
};

function Subfeatures({
  className,
  parentFeatureState,
  isAdding,
  featureAdderInputRef,
}: SubfeaturesProps) {
  const { allFeaturesDispatch } = useAllFeatures();

  const handleReorder = (subfeatureIds: string[]) => {
    allFeaturesDispatch({
      dispatchType: AllFeaturesDispatchType.SET_SUBFEATURES,
      featureState: parentFeatureState,
      subfeatureIds,
    });
  };

  return (
    <div className={`${className} space-y-1 h-full`}>
      <Reorder.Group
        className="mt-1 space-y-1"
        axis="y"
        values={Array.from(parentFeatureState.subfeatureIds)}
        onReorder={handleReorder}
      >
        {Array.from(parentFeatureState.subfeatureIds).map((subfeatureId) => (
          // TODO: Fix animation
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
      {isAdding && (
        <FeatureAdder
          featureAdderInputRef={featureAdderInputRef}
          parentFeatureState={parentFeatureState}
        />
      )}
    </div>
  );
}

interface SubfeatureProps {
  subfeatureId: string;
}

function Subfeature({ subfeatureId }: SubfeatureProps) {
  const { allFeatures } = useAllFeatures();

  const subfeatureState = (() => {
    const newSubfeatureState = allFeatures.get(subfeatureId);
    return isSubfeatureState(newSubfeatureState) ? newSubfeatureState : null;
  })();

  if (isAreaState(subfeatureState)) {
    return <Area areaState={subfeatureState} />;
  }

  if (isPointState(subfeatureState)) {
    return <Point pointState={subfeatureState} />;
  }
}

export { Subfeatures };
