"use client";

import { useFormStatus } from "react-dom";
import { type ComponentProps } from "react";

type SignInButtonProps = ComponentProps<"button">;

const SignInButton = ({ children, ...props }: SignInButtonProps) => {
  const { pending, action } = useFormStatus();

  return (
    <button
      {...props}
      className="border-black border rounded-3xl px-3 py-2 text-black bg-green-2 text-nowrap w-min"
      type="submit"
      aria-disabled={pending}
    >
      {children}
    </button>
  );
};

export { SignInButton };
