import { AreaState, PointState, QuizState } from "@/types";
import { Disclosure, Menu } from "@headlessui/react";
import { useState } from "react";
import { FaChevronRight, FaEllipsisVertical } from "react-icons/fa6";
import { Locations } from "./Locations";

interface AreaProps {
  location: AreaState;
  addLocation: (
    parentLocation: QuizState | AreaState,
    location: AreaState | PointState,
  ) => void;
  toggleLocationOpen: (targetLocation: AreaState) => void;
  deleteLocation: (targetLocation: AreaState | PointState) => void;
  setFocusedLocation: (location: AreaState | PointState | null) => void;
}

export default function Area({
  location,
  addLocation,
  toggleLocationOpen,
  deleteLocation,
  setFocusedLocation,
}: AreaProps) {
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [willToggle, setWillToggle] = useState<boolean>(false);

  function handleFocus() {
    if (!mouseDown) {
      setWillToggle(true);
    }

    setFocusedLocation(location);
  }

  function handleBlur() {
    setWillToggle(false);
  }

  function handleMouseDown() {
    setMouseDown(true);
  }

  function handleMouseUp() {
    setMouseDown(false);
  }

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (willToggle) {
      toggleLocationOpen(location);
    } else {
      event.preventDefault();
      setWillToggle(true);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  return (
    <Disclosure defaultOpen={location.open}>
      <div className="relative">
        <div className="quiz-builder-item-decorator-left-1 z-20">
          <Menu>
            <Menu.Button className="h-full w-full rounded-3xl flex items-center justify-center">
              <FaEllipsisVertical className="text-gray-400" />
            </Menu.Button>
            <Menu.Items className="absolute origin-top-left left-0 top-full z-30 bg-gray-500 rounded-3xl p-2 mt-2 mb-1">
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
        </div>
        <Disclosure.Button
          className={`quiz-builder-item quiz-builder-location cursor-pointer focus:outline outline-2 outline-red-600`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          <span>{location.fullName}</span>
          <div className="quiz-builder-item-decorator-right-1">
            <FaChevronRight
              className={`${location.open ? "rotate-90" : ""} w-4 h-auto`}
            />
          </div>
        </Disclosure.Button>
      </div>
      <Disclosure.Panel>
        <Locations
          className="ml-10"
          parent={location}
          addLocation={addLocation}
          toggleLocationOpen={toggleLocationOpen}
          deleteLocation={deleteLocation}
          setFocusedLocation={setFocusedLocation}
        />
      </Disclosure.Panel>
    </Disclosure>
  );
}
