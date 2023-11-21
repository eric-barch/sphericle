import { Menu } from "@headlessui/react";
import { FaEllipsisVertical } from "react-icons/fa6";

interface EditLocationButtonProps {
  className?: string;
}

export default function EditLocationButton({
  className,
}: EditLocationButtonProps) {
  return (
    <Menu>
      <Menu.Button className={className}>
        <FaEllipsisVertical className="w-4 h-4" />
      </Menu.Button>
      <Menu.Items className="absolute z-10 mt-1 top-full left-0 bg-gray-500 rounded-3xl p-1">
        <Menu.Item>
          {({ active }) => (
            <div
              className={`p-1 rounded-3xl cursor-pointer min-w-max ${
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
              className={`p-1 rounded-3xl cursor-pointer min-w-max ${
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
