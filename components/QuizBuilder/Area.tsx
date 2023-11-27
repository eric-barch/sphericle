import { AreaState, PointState } from "@/types";
import { Disclosure } from "@headlessui/react";
import { KeyboardEvent, MouseEvent, useState, useRef } from "react";
import { FaChevronRight } from "react-icons/fa6";
import EditLocationButton from "./EditLocationButton";
import LocationName from "./LocationName";
import { Sublocations } from "./Sublocations";

interface AreaProps {
  areaState: AreaState;
  setAreaState: (areaState: AreaState) => void;
  onToggleOpen: () => void;
  rename: (name: string) => void;
  onDelete: () => void;
  setDisplayedLocation: (location: AreaState | PointState | null) => void;
}

export default function Area({
  areaState,
  setAreaState,
  onToggleOpen,
  rename,
  onDelete,
  setDisplayedLocation,
}: AreaProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [willToggle, setWillToggle] = useState<boolean>(false);
  const [renaming, setRenaming] = useState<boolean>(false);
  const [outlined, setOutlined] = useState<boolean>(false);

  function handleFocus() {
    if (!mouseDown) {
      setWillToggle(true);
    }

    setOutlined(true);
    handleDisplay();
  }

  function handleBlur() {
    setOutlined(false);
    setWillToggle(false);
  }

  function handleMouseDown() {
    setMouseDown(true);
  }

  function handleMouseUp() {
    setMouseDown(false);
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (willToggle) {
      onToggleOpen();
    } else {
      event.preventDefault();
      setWillToggle(true);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  function handleDisplay() {
    setDisplayedLocation(areaState);
  }

  return (
    <Disclosure defaultOpen={areaState.open}>
      <div ref={areaRef} className="relative">
        <EditLocationButton
          className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl left-1.5"
          location={areaState}
          setRenaming={setRenaming}
          onDisplay={handleDisplay}
          onDelete={onDelete}
        />
        <Disclosure.Button
          className={`w-full p-1 rounded-3xl text-left cursor-pointer bg-gray-600 ${
            outlined ? "outline outline-2 outline-red-600" : ""
          }`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          <LocationName
            location={areaState}
            renaming={renaming}
            rename={rename}
            setRenaming={setRenaming}
          />
          <OpenChevron
            className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-3xl right-1"
            open={areaState.open}
          />
        </Disclosure.Button>
      </div>
      <Disclosure.Panel>
        <Sublocations
          className="ml-10"
          parentState={areaState}
          setParentState={setAreaState}
          setDisplayedLocation={setDisplayedLocation}
          setParentOutlined={setOutlined}
        />
      </Disclosure.Panel>
    </Disclosure>
  );
}

interface OpenChevronProps {
  className?: string;
  open: boolean;
}

function OpenChevron({ className, open }: OpenChevronProps) {
  return (
    <div className={className}>
      <FaChevronRight className={`${open ? "rotate-90" : ""} w-4 h-4`} />
    </div>
  );
}
