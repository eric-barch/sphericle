interface LocationTextProps {
  text: string;
}

export default function LocationText({ text }: LocationTextProps) {
  return (
    <div className="flex-grow min-w-0 mx-8">
      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
        {text}
      </div>
    </div>
  );
}
