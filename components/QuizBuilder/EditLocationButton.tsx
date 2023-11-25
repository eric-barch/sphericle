import { AreaState, PointState } from "@/types";
import { Menu } from "@headlessui/react";
import { FocusEvent, MouseEvent, RefObject } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";

interface EditLocationButtonProps {
  className?: string;
  location: AreaState | PointState;
  setRenaming: (renaming: boolean) => void;
  deleteLocation: (location: AreaState | PointState | null) => void;
  setDisplayedLocation: (location: AreaState | PointState | null) => void;
}

export default function EditLocationButton({
  className,
  location,
  setRenaming,
  deleteLocation,
  setDisplayedLocation,
}: EditLocationButtonProps) {
  function handleFocus(event: FocusEvent<HTMLButtonElement>) {
    setDisplayedLocation(location);
  }

  function handleRenameClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    setRenaming(true);
  }

  function handleDeleteClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    deleteLocation(location);
  }

  return (
    <Menu>
      <Menu.Button className={className} onFocus={handleFocus}>
        <FaEllipsisVertical className="w-4 h-4" />
      </Menu.Button>
      <Menu.Items className="absolute z-10 top-full left-0 bg-gray-500 rounded-custom p-1 space-y-1 focus:outline-none">
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
