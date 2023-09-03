"use client";

import { useState } from "react";
import LocationComponent, { LocationStateTreeNode } from "../Location";
import LocationAdder from "../LocationAdder";

export interface LocationStateTreeRoot {
  children: LocationStateTreeNode[];
}

export default function Root() {
  const [root, setRoot] = useState<LocationStateTreeRoot>({
    children: [],
  });

  const onToggleOpen = (location: LocationStateTreeNode) => {
    location.isOpen = !location.isOpen;
    setRoot({ ...root });
  };

  const onToggleActive = (location: LocationStateTreeNode) => {
    location.isChecked = !location.isChecked;
    setRoot({ ...root });
  };

  const onAddChild = (
    parent: LocationStateTreeNode | LocationStateTreeRoot,
    value: string,
    label: string,
  ) => {
    const child = {
      parent,
      value,
      label,
      children: [],
      isChecked: true,
      isOpen: false,
    };
    parent.children.push(child);
    setRoot({ ...root });
  };

  const onDelete = (location: LocationStateTreeNode) => {
    const parent = location.parent;
    const targetIndex = parent.children.indexOf(location);
    parent.children.splice(targetIndex, 1);
    setRoot({ ...root });
  };

  return (
    <div className="space-y-1">
      {root.children.map((childState, index) => (
        <LocationComponent
          key={index}
          state={childState}
          onToggleActive={onToggleActive}
          onToggleOpen={onToggleOpen}
          onAddChild={onAddChild}
          onDelete={onDelete}
        />
      ))}
      <LocationAdder
        onAdd={(value, label) => {
          onAddChild(root, value, label);
        }}
      />
    </div>
  );
}
