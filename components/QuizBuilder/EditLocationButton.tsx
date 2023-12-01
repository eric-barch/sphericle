import { useQuizDispatch } from "@/components/QuizProvider";
import { AreaState, LocationType, PointState, QuizDispatchType } from "@/types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MouseEvent } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";

interface EditLocationButtonProps {
  className?: string;
  location: AreaState | PointState;
  setIsAdding?: (isAdding: boolean) => void;
  setIsRenaming: (isRenaming: boolean) => void;
}

export default function EditLocationButton({
  className,
  location,
  setIsAdding = () => {},
  setIsRenaming,
}: EditLocationButtonProps) {
  const quizDispatch = useQuizDispatch();

  function handleAddSublocationClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    setIsAdding(true);
  }

  function handleRenameClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    setIsRenaming(true);
  }

  function handleDeleteClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    quizDispatch({
      type: QuizDispatchType.Deleted,
      location,
    });
  }

  return (
    <div className={className}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <FaEllipsisVertical className="w-4 h-4" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="absolute z-10 top-2 ml-[-1.2rem] bg-gray-500 rounded-custom p-1 space-y-1 focus:outline-none"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            {location.locationType === LocationType.Area && (
              <DropdownMenu.Item
                onClick={handleAddSublocationClick}
                className="rounded-3xl cursor-pointer px-7 py-1 min-w-max data-[highlighted]:bg-gray-600 focus:outline-none"
              >
                Add Sublocation
              </DropdownMenu.Item>
            )}
            <DropdownMenu.Item
              onClick={handleRenameClick}
              className="rounded-3xl cursor-pointer px-7 py-1 min-w-max data-[highlighted]:bg-gray-600 focus:outline-none"
            >
              Rename
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={handleDeleteClick}
              className="rounded-3xl cursor-pointer px-7 py-1 min-w-max data-[highlighted]:bg-gray-600 focus:outline-none"
            >
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
