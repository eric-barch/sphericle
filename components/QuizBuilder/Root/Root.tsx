"use client";

import Location, { State as LocationState } from "../Location";
import { useState } from "react";
import LocationAdder from "../LocationAdder";

export interface RootState {
  children: LocationState[];
}

interface Props {
  state: RootState;
}

export default function Root(props: Props) {
  const [root, setRoot] = useState<RootState>({
    children: [],
  });

  const onToggleOpen = (location: LocationState) => {
    location.isOpen = !location.isOpen;
    setRoot({ ...root });
  };

  const onToggleActive = (location: LocationState) => {
    location.isChecked = !location.isChecked;
    setRoot({ ...root });
  };

  const onAddChild = (parent: LocationState | RootState, value: string) => {
    const child = {
      parent,
      children: [],
      value,
      isChecked: true,
      isOpen: false,
    };
    parent.children.push(child);
    setRoot({ ...root });
  };

  const onDelete = (target: LocationState) => {
    const parent = target.parent;
    const targetIndex = parent.children.indexOf(target);
    parent.children.splice(targetIndex, 1);
    setRoot({ ...root });
  };

  return (
    <>
      {props.state.children.map((childState, index) => (
        <Location
          key={index}
          state={childState}
          onToggleActive={onToggleActive}
          onToggleOpen={onToggleOpen}
          onAddChild={onAddChild}
          onDelete={onDelete}
        />
      ))}
      <LocationAdder
        onAdd={(value) => {
          const newState: LocationState = {
            parent: props.state,
            children: [],
            value,
            isOpen: false,
            isChecked: false,
          };
          onAddChild(newState, value);
        }}
      />
    </>
  );
}
