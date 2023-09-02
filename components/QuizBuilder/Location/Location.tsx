"use client";

import * as Accordion from "@radix-ui/react-accordion";
import ToggleOpenCaret from "./ToggleOpenCaret";
import ToggleActiveButton from "./ToggleActiveButton";
import LocationAdder from "../LocationAdder";

export interface Props {
  state: State;
  onToggleActive: (state: State) => void;
  onToggleOpen: (state: State) => void;
  onAddChild: (state: State) => void;
  onDelete: (state: State) => void;
}

export interface State {
  parent: State | null;
  children: State[];
  value: string;
  isOpen: boolean;
  isChecked: boolean;
}

export default function Location({
  state,
  onToggleActive,
  onToggleOpen,
  onAddChild,
  onDelete,
}: Props) {
  function handleToggleActive() {
    onToggleActive(state);
  }

  function handleToggleOpen() {
    onToggleOpen(state);
  }

  function handleAddChild() {
    onAddChild(state);
  }

  function handleDelete() {
    onDelete(state);
  }

  return (
    <Accordion.Root
      type="multiple"
      value={state.isOpen ? [state.value] : ["closed"]}
      onValueChange={handleToggleOpen}
    >
      <Accordion.Item value={state.value}>
        <div className="relative">
          <Accordion.Trigger className="p-2 w-full bg-gray-600 rounded-full">
            <Accordion.Header className="text-left pl-6">
              <ToggleOpenCaret isOpen={state.isOpen} />
              {state.value}
            </Accordion.Header>
          </Accordion.Trigger>
          <ToggleActiveButton
            isChecked={state.isChecked}
            onClick={handleToggleActive}
          />
        </div>
        <Accordion.Content className="pl-10 pt-1 pb-1 space-y-1">
          {state.children.map((childState, index) => (
            <Location
              key={index}
              state={childState}
              onToggleActive={onToggleActive}
              onToggleOpen={onToggleOpen}
              onAddChild={onAddChild}
              onDelete={onDelete}
            />
          ))}
          <LocationAdder />
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
