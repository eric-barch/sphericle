import { useAllFeatures } from "@/components/all-features-provider";
import { isParentFeatureState } from "@/helpers/feature-type-guards";
import {
  AllFeaturesDispatchType,
  QuizBuilderStateDispatchType,
  SubfeatureState,
} from "@/types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";
import { MouseEvent, useCallback } from "react";
import { useQuizBuilderState } from "./quiz-builder-state-provider";

interface EditFeatureButtonProps {
  featureState: SubfeatureState;
}

export default function EditFeatureButton({
  featureState,
}: EditFeatureButtonProps) {
  const { allFeaturesDispatch } = useAllFeatures();
  const { quizBuilderStateDispatch } = useQuizBuilderState();

  const handleTriggerClick = useCallback(() => {
    quizBuilderStateDispatch({
      dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
      featureState,
    });
  }, [featureState, quizBuilderStateDispatch]);

  const handleAddSubfeatureClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();

      if (!isParentFeatureState(featureState)) {
        return;
      }

      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_IS_OPEN,
        featureState: featureState,
        isOpen: true,
      });

      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_IS_ADDING,
        featureState: featureState,
        isAdding: true,
      });
    },
    [featureState, quizBuilderStateDispatch],
  );

  const handleRenameClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();

      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_IS_RENAMING,
        featureState: featureState,
        isRenaming: true,
      });
    },
    [featureState, quizBuilderStateDispatch],
  );

  const handleDeleteClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();

      allFeaturesDispatch({
        dispatchType: AllFeaturesDispatchType.DELETE,
        featureId: featureState.featureId,
      });
    },
    [featureState, allFeaturesDispatch],
  );

  return (
    <DropdownMenu.Root onOpenChange={handleTriggerClick}>
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
