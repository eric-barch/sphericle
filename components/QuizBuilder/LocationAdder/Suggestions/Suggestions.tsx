import { Command } from "cmdk";

export const suggestions = [
  {
    value: "asia",
    label: "Asia",
  },
  {
    value: "africa",
    label: "Africa",
  },
  {
    value: "north-america",
    label: "North America",
  },
  {
    value: "south-america",
    label: "South America",
  },
  {
    value: "europe",
    label: "Europe",
  },
  {
    value: "antarctica",
    label: "Antarctica",
  },
  {
    value: "australia",
    label: "Australia",
  },
];

export interface Props {
  value: string;
  setIsOpen: (isOpen: boolean) => void;
  onSelectSuggestion: (value: string, label: string) => void;
}

export default function Suggestions(props: Props) {
  return (
    <Command.List className="bg-gray-500 rounded-3xl p-2 mt-1 mb-1">
      <Command.Empty className="p-2 pl-2 rounded-full">
        No location found.
      </Command.Empty>
      <Command.Group>
        {suggestions.map((suggestion) => (
          <Command.Item
            className={`p-2 pl-2 rounded-full cursor-pointer ${
              suggestion.value === props.value ? "bg-gray-600" : ""
            }`}
            key={suggestion.value}
            value={suggestion.value}
            onSelect={() => {
              props.setIsOpen(false);
              props.onSelectSuggestion(suggestion.value, suggestion.label);
            }}
          >
            {suggestion.label}
          </Command.Item>
        ))}
      </Command.Group>
    </Command.List>
  );
}
