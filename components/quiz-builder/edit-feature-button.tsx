import { useAllFeatures } from "@/components/all-features-provider";
import { AllFeaturesDispatchType, QuizBuilderStateDispatchType } from "@/types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";
import { MouseEvent, RefObject, useCallback } from "react";
import { useQuizBuilderState } from "./quiz-builder-state-provider";

interface EditFeatureButtonProps {
  featureId: string;
  canHaveSubfeatures: boolean;
  renameInputRef: RefObject<HTMLInputElement>;
}

export default function EditFeatureButton({
  featureId,
  canHaveSubfeatures,
  renameInputRef,
}: EditFeatureButtonProps) {
  const { allFeaturesDispatch } = useAllFeatures();
  const { quizBuilderStateDispatch } = useQuizBuilderState();

  const handleTriggerClick = useCallback(() => {
    quizBuilderStateDispatch({
      dispatchType: QuizBuilderStateDispatchType.SET_SELECTED,
      featureId,
    });
  }, [featureId, quizBuilderStateDispatch]);

  const handleAddSubfeatureClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();

      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_IS_OPEN,
        featureId,
        isOpen: true,
      });

      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_IS_ADDING,
        featureId,
        isAdding: true,
      });
    },
    [featureId, quizBuilderStateDispatch],
  );

  const handleRenameClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();

      quizBuilderStateDispatch({
        dispatchType: QuizBuilderStateDispatchType.SET_IS_RENAMING,
        featureId,
        isRenaming: true,
      });

      setTimeout(() => {
        renameInputRef.current?.focus();
        renameInputRef.current?.select();
      }, 0);
    },
    [featureId, quizBuilderStateDispatch, renameInputRef],
  );

  const handleDeleteClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();

      allFeaturesDispatch({
        dispatchType: AllFeaturesDispatchType.DELETE,
        featureId,
      });
    },
    [featureId, allFeaturesDispatch],
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
        {canHaveSubfeatures && (
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
