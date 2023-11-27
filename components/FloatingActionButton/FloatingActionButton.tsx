interface FloatingActionButtonProps {
  className?: string;
  text: string;
  onClick: () => void;
}

export default function FloatingActionButton({
  className,
  text,
  onClick,
}: FloatingActionButtonProps) {
  return (
    <button
      className={`${className} rounded-3xl px-3 py-2 bg-green-700 m-3`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
