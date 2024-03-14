"use client";

import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={className} ref={ref} {...props} />;
  },
);

Button.displayName = "Button";

export { Button };
