import { AreaState, LocationType, PointState, QuizDispatchType } from "@/types";
import { Menu } from "@headlessui/react";
import { FocusEvent, MouseEvent } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";
import { useQuiz, useQuizDispatch } from "../QuizProvider";

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
  const quiz = useQuiz();
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
    <Menu>
      <Menu.Button className={className}>
        <FaEllipsisVertical className="w-4 h-4" />
      </Menu.Button>
      <Menu.Items className="absolute z-10 top-full left-0 bg-gray-500 rounded-custom p-1 space-y-1 focus:outline-none">
        {location.locationType === LocationType.Area && (
          <Menu.Item>
            {({ active }) => (
              <div
                onClick={handleAddSublocationClick}
                className={`rounded-3xl cursor-pointer px-7 py-1 min-w-max ${
                  active ? "bg-gray-600" : ""
                }`}
              >
                Add Sublocation
              </div>
            )}
          </Menu.Item>
        )}
        <Menu.Item>
          {({ active }) => (
            <div
              onClick={handleRenameClick}
              className={`rounded-3xl cursor-pointer px-7 py-1 min-w-max ${
                active ? "bg-gray-600" : ""
              }`}
            >
              Rename
            </div>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <div
              onClick={handleDeleteClick}
              className={`rounded-3xl cursor-pointer px-7 py-1 min-w-max ${
                active ? "bg-gray-600" : ""
              }`}
            >
              Delete
            </div>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
