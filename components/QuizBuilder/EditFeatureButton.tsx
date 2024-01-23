import { useAllFeatures } from "@/components/AllFeaturesProvider";
import { isAreaState } from "@/helpers/feature-type-guards";
import { AllFeaturesDispatchType, QuizBuilderStateDispatchType } from "@/types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";
import { MouseEvent } from "react";
import { useQuizBuilderState } from "./QuizBuilderStateProvider";

interface EditFeatureButtonProps {
  featureId: string;
}

export default function EditFeatureButton({
  featureId,
}: EditFeatureButtonProps) {
  const { allFeatures, allFeaturesDispatch } = useAllFeatures();
  const { quizBuilderStateDispatch } = useQuizBuilderState();

  const feature = allFeatures.get(featureId);

  function handleAddSubfeatureClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();

    quizBuilderStateDispatch({
      type: QuizBuilderStateDispatchType.SET_FEATURE_IS_ADDING,
      featureId,
      isAdding: true,
    });
  }

  function handleRenameClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();

    quizBuilderStateDispatch({
      type: QuizBuilderStateDispatchType.SET_FEATURE_IS_RENAMING,
      featureId,
      isRenaming: true,
    });
  }

  function handleDeleteClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();

    allFeaturesDispatch({
      type: AllFeaturesDispatchType.DELETE_FEATURE,
      featureId,
    });
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-2xl left-1.5">
        <MoreVertical className="w-5 h-5" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="absolute z-10 top-1 ml-[-1.2rem] bg-gray-500 rounded-1.25 p-1 space-y-1 focus:outline-none"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {isAreaState(feature) && (
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
