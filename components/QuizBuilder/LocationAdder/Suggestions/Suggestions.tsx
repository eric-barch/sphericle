import { Command } from "cmdk"

export const suggestions = [
  {
    value: "asia",
    label: "Asia",
  }, {
    value: "africa",
    label: "Africa",
  }, {
    value: "north-america",
    label: "North America",
  }, {
    value: "south-america",
    label: "South America",
  }, {
    value: "europe",
    label: "Europe",
  }, {
    value: "antarctica",
    label: "Antarctica",
  }, {
    value: "australia",
    label: "Australia",
  }
]

export default function Suggestions({
  isOpen,
  value,
  setValue,
  setIsOpen,
  focusedIndex
}: {
  isOpen: boolean,
  value: string,
  setValue: (value: string) => void,
  setIsOpen: (isOpen: boolean) => void,
  focusedIndex: number
}) {
  return isOpen ? (
    <>
      <Command.Empty>No results found.</Command.Empty>
      <Command.Group className='bg-gray-500 rounded-3xl p-2 pl-4 mt-1 mb-1'>
        {suggestions.map((suggestion, index) => (
          <Command.Item
            key={suggestion.value}
            className={index === focusedIndex ? "bg-gray-600" : ""}
            onSelect={(currentValue) => {
              setValue(currentValue === value ? "" : currentValue)
              setIsOpen(false)
            }}
          >
            {suggestion.label}
          </Command.Item>
        ))}
      </Command.Group>
    </>
  ) : (
    <></>
  );
}