"use client";

import * as Accordion from "@radix-ui/react-accordion";
import ToggleOpenCaret from "./ToggleOpenCaret";
import ToggleActiveButton from "./ToggleActiveButton";
import LocationAdder from "../LocationAdder";
import { RootState } from "../Root";

export interface State {
  parent: State | RootState;
  children: State[];
  value: string;
  isOpen: boolean;
  isChecked: boolean;
}

export interface Props {
  state: State;
  onToggleActive: (state: State) => void;
  onToggleOpen: (state: State) => void;
  onAddChild: (state: State | RootState, value: string) => void;
  onDelete: (state: State) => void;
}

export default function Location(props: Props) {
  return (
    <Accordion.Root
      type="multiple"
      value={props.state.isOpen ? [props.state.value] : ["closed"]}
      onValueChange={() => props.onToggleOpen(props.state)}
    >
      <Accordion.Item value={props.state.value}>
        <div className="relative">
          <Accordion.Trigger className="p-2 w-full bg-gray-600 rounded-full">
            <Accordion.Header className="text-left pl-6">
              <ToggleOpenCaret isOpen={props.state.isOpen} />
              {props.state.value}
            </Accordion.Header>
          </Accordion.Trigger>
          <ToggleActiveButton
            isChecked={props.state.isChecked}
            onClick={() => props.onToggleActive(props.state)}
          />
        </div>
        <Accordion.Content className="pl-10 pt-1 pb-1 space-y-1">
          {props.state.children.map((childState, index) => (
            <Location
              key={index}
              state={childState}
              onToggleActive={props.onToggleActive}
              onToggleOpen={props.onToggleOpen}
              onAddChild={props.onAddChild}
              onDelete={props.onDelete}
            />
          ))}
          <LocationAdder
            onAdd={(value) => {
              const newState: State = {
                parent: props.state,
                children: [],
                value: value,
                isOpen: false,
                isChecked: false,
              };
              props.onAddChild(newState, value);
            }}
          />
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
