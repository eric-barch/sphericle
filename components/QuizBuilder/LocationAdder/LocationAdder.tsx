"use client";

import { Command } from "cmdk";
import * as React from "react";
import Suggestions from './Suggestions';
import { suggestions } from './Suggestions';

export default function LocationAdder() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [focusedIndex, setFocusedIndex] = React.useState(-1);  // Initialize to -1 for no selection

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusedIndex((prevIndex) => Math.min(prevIndex + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (event.key === "Enter" && focusedIndex !== -1) {
      setValue(suggestions[focusedIndex].value);
      setIsOpen(false);
    }
  };

  return (
    <Command
      label="add-location"
      value={value}
      onKeyDown={handleKeyDown}
    >
      <Command.Input
        className='bg-transparent border-white border-2 p-2 pl-4 rounded-full w-full'
        value={value}
        onFocus={() => {
          setIsOpen(true);
          setFocusedIndex(-1);
        }}
        onBlur={() => setIsOpen(false)} />
      <Suggestions
        isOpen={isOpen}
        value={value}
        setValue={setValue}
        setIsOpen={setIsOpen}
        focusedIndex={focusedIndex}
      />
    </Command>
  )
}