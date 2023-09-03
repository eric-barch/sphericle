"use client";

import * as Accordion from "@radix-ui/react-accordion";
import LocationAdder from "../LocationAdder";
import { LocationStateTreeRoot } from "../Root";
import ToggleActiveButton from "./ToggleActiveButton";
import ToggleOpenCaret from "./ToggleOpenCaret";

export interface LocationStateTreeNode {
  parent: LocationStateTreeNode | LocationStateTreeRoot;
  children: LocationStateTreeNode[];
  value: string;
  label: string;
  isOpen: boolean;
  isChecked: boolean;
}

export interface LocationComponentProps {
  state: LocationStateTreeNode;
  onToggleActive: (location: LocationStateTreeNode) => void;
  onToggleOpen: (location: LocationStateTreeNode) => void;
  onAddChild: (
    parent: LocationStateTreeNode | LocationStateTreeRoot,
    value: string,
    label: string,
  ) => void;
  onDelete: (location: LocationStateTreeNode) => void;
}

export default function LocationComponent(props: LocationComponentProps) {
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
              {props.state.label}
            </Accordion.Header>
          </Accordion.Trigger>
          <ToggleActiveButton
            isChecked={props.state.isChecked}
            onClick={() => props.onToggleActive(props.state)}
          />
        </div>
        <Accordion.Content className="pl-10 pt-1 pb-1 space-y-1">
          {props.state.children.map((childState, index) => (
            <LocationComponent
              key={index}
              state={childState}
              onToggleActive={props.onToggleActive}
              onToggleOpen={props.onToggleOpen}
              onAddChild={props.onAddChild}
              onDelete={props.onDelete}
            />
          ))}
          <LocationAdder
            onAdd={(value, label) => {
              props.onAddChild(props.state, value, label);
            }}
          />
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
