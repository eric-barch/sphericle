import { Menu } from "@headlessui/react";
import { FaEllipsisVertical } from "react-icons/fa6";

interface EditLocationButtonProps {
  className?: string;
}

export default function EditLocationButton({
  className,
}: EditLocationButtonProps) {
  function handleRenameClick(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  function handleDeleteClick(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  return (
    <Menu>
      <Menu.Button className={className}>
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
              onClick={handleRenameClick}
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
