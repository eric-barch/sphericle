import { FaRegCircle, FaCircleCheck } from "react-icons/fa6";

export default function ToggleActiveButton({
  isChecked,
  onClick,
}: {
  isChecked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="z-10 absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl rounded-full"
      onClick={onClick}
    >
      {isChecked ? <FaCircleCheck /> : <FaRegCircle />}
    </button>
  );
}
