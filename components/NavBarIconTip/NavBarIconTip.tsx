'use client'

import { useEffect, useRef } from 'react';

interface NavBarIconTipProps {
  text: string;
}

export default function NavBarIconTip({ text }: NavBarIconTipProps) {
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (tooltipRef.current) {
      const tip: HTMLElement = tooltipRef.current;

      // Check if it's overflowing on the left
      const tipRect = tip.getBoundingClientRect();
      const parentRect = tip.parentElement!.getBoundingClientRect();

      if (tipRect.left < parentRect.left) {
        tip.style.left = `${parentRect.left - tipRect.left}px`;
      }
    }
  }, [tooltipRef]);

  return (
    <div ref={tooltipRef} className="navbar-icon-tip">
      {text}
    </div>
  );
}
