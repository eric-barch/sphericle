import { FaRegCircle, FaCircleCheck } from 'react-icons/fa6'

export default function LocationActiveButton({
  isChecked,
  onClick,
  className,
}: {
  isChecked: boolean,
  onClick: () => void,
  className?: string,
}) {
  return (
    <button
      className={className}
      onClick={onClick}>
      {isChecked ? <FaCircleCheck /> : <FaRegCircle />}
    </button>
  );
}