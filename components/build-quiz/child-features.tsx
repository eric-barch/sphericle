"use client";

import { isArea, isChild, isPoint } from "@/helpers";
import { cn } from "@/lib/utils";
import { useAllFeatures } from "@/providers";
import { AllFeaturesDispatchType, ParentFeature, Root } from "@/types";
import { Reorder } from "framer-motion";
import { RefObject, useMemo } from "react";
import { Area } from "./area";
import { FeatureSearch } from "./feature-search";
import { Point } from "./point";

type ChildFeaturesProps =
  | {
      className?: string;
      parent: ParentFeature;
      isAdding: boolean;
      featureSearchRef: RefObject<HTMLInputElement>;
    }
  | {
      className?: string;
      parent: Root;
      isAdding: boolean;
      featureSearchRef?: never;
    };

const ChildFeatures = (props: ChildFeaturesProps) => {
  const { className, parent, isAdding, featureSearchRef } = props;

  const { allFeaturesDispatch } = useAllFeatures();
  const handleReorder = (childIds: string[]) => {
    allFeaturesDispatch({
      type: AllFeaturesDispatchType.SET_CHILDREN,
      featureId: parent.id,
      childIds,
    });
  };

  return (
    <div className={cn(className, "space-y-1 h-full")}>
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
        <FeatureSearch inputRef={featureSearchRef} parent={parent} />
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

  const feature = useMemo(() => {
    const feature = allFeatures.get(featureId);
    if (isChild(feature)) return feature;
  }, [allFeatures, featureId]);

  if (isArea(feature)) {
    return <Area area={feature} />;
  }

  if (isPoint(feature)) {
    return <Point point={feature} />;
  }
};

export { ChildFeatures };
