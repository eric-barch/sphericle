"use client";

import { useAllFeatures } from "@/components/all-features-provider";
import {
  isAreaState,
  isPointState,
  isSubfeatureState,
} from "@/helpers/feature-type-guards";
import {
  AllFeaturesDispatchType,
  AreaState,
  ParentFeatureState,
  RootState,
} from "@/types";
import { Reorder } from "framer-motion";
import { useCallback, useMemo } from "react";
import Area from "./area";
import FeatureAdder from "./feature-adder";
import Point from "./point";
import { useQuizBuilderState } from "./quiz-builder-state-provider";

type SubfeaturesProps =
  | {
      className?: string;
      parentFeatureState: RootState;
      featureAdderInputRef?: never;
    }
  | {
      className?: string;
      parentFeatureState: ParentFeatureState;
      featureAdderInputRef: React.RefObject<HTMLInputElement>;
    };

export default function Subfeatures({
  className,
  parentFeatureState,
  featureAdderInputRef,
}: SubfeaturesProps) {
  const { allFeaturesDispatch } = useAllFeatures();
  const { quizBuilderState } = useQuizBuilderState();

  const handleReorder = useCallback(
    (subfeatureIds: string[]) => {
      allFeaturesDispatch({
        dispatchType: AllFeaturesDispatchType.SET_SUBFEATURES,
        featureState: parentFeatureState,
        subfeatureIds,
      });
    },
    [allFeaturesDispatch, parentFeatureState],
  );

  return (
    <div className={`${className} space-y-1 h-full`}>
      <Reorder.Group
        className="mt-1 space-y-1"
        axis="y"
        values={Array.from(parentFeatureState.subfeatureIds)}
        onReorder={handleReorder}
      >
        {Array.from(parentFeatureState.subfeatureIds).map((subfeatureId) => (
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
      {quizBuilderState.addingFeatureIds.has(parentFeatureState.featureId) && (
        <FeatureAdder
          parentFeatureState={parentFeatureState}
          featureAdderInputRef={featureAdderInputRef}
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

  const subfeatureState = useMemo(() => {
    const newSubfeatureState = allFeatures.get(subfeatureId);
    return isSubfeatureState(newSubfeatureState) ? newSubfeatureState : null;
  }, [allFeatures, subfeatureId]);

  if (isAreaState(subfeatureState)) {
    return <Area areaState={subfeatureState} />;
  }

  if (isPointState(subfeatureState)) {
    return <Point pointState={subfeatureState} />;
  }
}
