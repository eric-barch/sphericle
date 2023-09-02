import { FaAngleRight } from "react-icons/fa6";

export default function ToggleOpenCaret({ isOpen }: { isOpen: boolean }) {
  return (
    <FaAngleRight
      className={`z-10 absolute left-2 top-1/2 transform -translate-y-1/2 ${
        isOpen ? "rotate-90" : ""
      }`}
    />
  );
}
