"use client";

import { useAllFeatures } from "@/components/AllFeaturesProvider";
import {
  isAreaState,
  isPointState,
  isSubfeatureState,
} from "@/helpers/feature-type-guards";
import {
  AllFeaturesDispatchType,
  ParentFeatureState,
  SubfeatureState,
} from "@/types";
import { Reorder } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import Area from "./Area";
import FeatureAdder from "./FeatureAdder";
import Point from "./Point";
import { useQuizBuilderState } from "./QuizBuilderStateProvider";

interface SubfeaturesProps {
  className?: string;
  parentFeatureState: ParentFeatureState;
}

export default function Subfeatures({
  className,
  parentFeatureState,
}: SubfeaturesProps) {
  const { allFeaturesDispatch } = useAllFeatures();
  const { quizBuilderState } = useQuizBuilderState();

  const handleReorder = useCallback(
    (subfeatureIds: string[]) => {
      allFeaturesDispatch({
        type: AllFeaturesDispatchType.SET_SUBFEATURES,
        parentFeature: parentFeatureState,
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
      {quizBuilderState.addingFeatureIds.has(parentFeatureState.id) && (
        <FeatureAdder parentFeatureState={parentFeatureState} />
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
