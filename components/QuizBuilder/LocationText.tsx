import { AreaState, PointState } from "@/types";
import { useEffect, useState } from "react";

interface LocationTextProps {
  location: AreaState | PointState;
  renaming: boolean;
  renameLocation: (location: AreaState | PointState, name: string) => void;
  setRenaming: (renaming: boolean) => void;
}

export default function LocationName({
  location,
  renaming,
  renameLocation,
  setRenaming,
}: LocationTextProps) {
  const currentName = location.userDefinedName
    ? location.userDefinedName
    : location.shortName;

  const [newName, setNewName] = useState(currentName);

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      renameLocation(location, newName);
      setRenaming(false);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setNewName(currentName);
      event.currentTarget.blur();
    }

    if (event.key === " ") {
      event.stopPropagation();
    }
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    if (currentName !== newName) {
      renameLocation(location, newName);
    }
    setRenaming(false);
  }

  useEffect(() => {
    console.log(
      `\nuserDefinedName: ${location.userDefinedName}\nshortName: ${location.shortName}`,
    );
  }, [location]);

  return (
    <div className="flex-grow min-w-0 px-7 overflow-hidden text-ellipsis whitespace-nowrap">
      {renaming ? (
        <input
          className="bg-transparent w-full focus:outline-none"
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      ) : (
        <>{currentName}</>
      )}
    </div>
  );
}
