import { useAllFeatures } from "@/components/AllFeaturesProvider";
import {
  isParentFeatureState,
  isSubfeatureState,
} from "@/helpers/feature-type-guards";
import {
  AllFeaturesDispatchType,
  QuizBuilderStateDispatchType,
  SubfeatureState,
} from "@/types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { useQuizBuilderState } from "./QuizBuilderStateProvider";

interface EditFeatureButtonProps {
  featureId: string;
}

export default function EditFeatureButton({
  featureId,
}: EditFeatureButtonProps) {
  const { allFeatures, allFeaturesDispatch } = useAllFeatures();
  const { quizBuilderStateDispatch } = useQuizBuilderState();

  const [featureState, setFeatureState] = useState<SubfeatureState>(() => {
    const initialFeatureState = allFeatures.get(featureId);

    if (!initialFeatureState || !isSubfeatureState(initialFeatureState)) {
      throw new Error("initialFeatureState must be a SubfeatureState.");
    }

    return initialFeatureState;
  });

  useEffect(() => {
    const featureState = allFeatures.get(featureId);

    if (!featureState || !isSubfeatureState(featureState)) {
      return;
    }

    setFeatureState(featureState);
  }, [featureId, allFeatures]);

  const handleAddSubfeatureClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();

      if (!isParentFeatureState(featureState)) {
        return;
      }

      quizBuilderStateDispatch({
        type: QuizBuilderStateDispatchType.SET_FEATURE_IS_OPEN,
        feature: featureState,
        isOpen: true,
      });

      quizBuilderStateDispatch({
        type: QuizBuilderStateDispatchType.SET_FEATURE_IS_ADDING,
        feature: featureState,
        isAdding: true,
      });
    },
    [featureState, quizBuilderStateDispatch],
  );

  const handleRenameClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();

      quizBuilderStateDispatch({
        type: QuizBuilderStateDispatchType.SET_FEATURE_IS_RENAMING,
        feature: featureState,
        isRenaming: true,
      });
    },
    [featureState, quizBuilderStateDispatch],
  );

  const handleDeleteClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();

      allFeaturesDispatch({
        type: AllFeaturesDispatchType.DELETE_FEATURE,
        feature: featureState,
      });
    },
    [featureState, allFeaturesDispatch],
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-2xl left-1.5">
        <MoreVertical className="w-5 h-5" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="absolute z-10 top-1 ml-[-1.2rem] bg-gray-500 rounded-1.25 p-1 space-y-1 focus:outline-none"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {isParentFeatureState(featureState) && (
          <DropdownMenu.Item
            onClick={handleAddSubfeatureClick}
            className="rounded-2xl cursor-pointer px-7 py-1 min-w-max data-[highlighted]:bg-gray-600 focus:outline-none"
          >
            Add Subfeature
          </DropdownMenu.Item>
        )}
        <DropdownMenu.Item
          onClick={handleRenameClick}
          className="rounded-2xl cursor-pointer px-7 py-1 min-w-max data-[highlighted]:bg-gray-600 focus:outline-none"
        >
          Rename
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onClick={handleDeleteClick}
          className="rounded-2xl cursor-pointer px-7 py-1 min-w-max data-[highlighted]:bg-gray-600 focus:outline-none"
        >
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
