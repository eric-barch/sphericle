"use client";

import { Command } from "cmdk";
import { useState } from "react";
import Suggestions from "./Suggestions";

export interface Props {
  onAdd: (value: string) => void;
}

export default function LocationAdder(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValueRaw] = useState("");

  const setValue = (newValue: string) => {
    if (newValue === undefined) return;
    setValueRaw(newValue);
  };

  return (
    <Command value={value} onValueChange={setValue}>
      <Command.Input
        placeholder="Add a location"
        className="bg-transparent border-white border-2 p-2 pl-4 rounded-full w-full"
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (
        <Suggestions
          value={value}
          setIsOpen={setIsOpen}
          onSelectSuggestion={(suggestionValue) => {
            props.onAdd(suggestionValue);
          }}
        />
      )}
    </Command>
  );
}
