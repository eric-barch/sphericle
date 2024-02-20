"use client";

import { cn } from "@/lib/utils";
import {
  Children,
  Fragment,
  MouseEvent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";

type SplitPaneProps = {
  className?: string;
};

const SplitPane = (props: PropsWithChildren<SplitPaneProps>) => {
  const { className } = props;
  const children = Children.toArray(props.children);

  const containerRef = useRef<HTMLDivElement>(null);

  const [isResizing, setIsResizing] = useState(false);
  const [paneIndex, setPaneIndex] = useState(0);
  const [paneWidths, setPaneWidths] = useState<number[]>([]);

  const handleMouseDown = (index: number) => {
    setIsResizing(true);
    setPaneIndex(index);
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!isResizing) return;

    const leftPanesWidth = paneWidths
      .slice(0, paneIndex)
      .reduce((a, b) => a + b, 0);
    const middlePanesWidth = paneWidths[paneIndex] + paneWidths[paneIndex + 1];

    const newPaneWidths = [...paneWidths];

    if (event.clientX < leftPanesWidth) {
      newPaneWidths[paneIndex] = 0;
      newPaneWidths[paneIndex + 1] = middlePanesWidth;
    } else if (event.clientX > leftPanesWidth + middlePanesWidth) {
      newPaneWidths[paneIndex] = middlePanesWidth;
      newPaneWidths[paneIndex + 1] = 0;
    } else {
      newPaneWidths[paneIndex] = event.clientX - leftPanesWidth;
      newPaneWidths[paneIndex + 1] =
        middlePanesWidth - newPaneWidths[paneIndex];
    }

    setPaneWidths(newPaneWidths);
  };

  const handleDoubleClick = (index: number) => {
    const newPaneWidths = [...paneWidths];

    newPaneWidths[index] = newPaneWidths[index + 1] =
      (paneWidths[index] + paneWidths[index + 1]) / 2;

    setPaneWidths(newPaneWidths);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const newContainerWidth = containerRef.current.offsetWidth;

    setPaneWidths(
      Array.from(
        { length: children.length },
        () => newContainerWidth / children.length,
      ),
    );
  }, [children.length]);

  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;

      if (!container) return;

      const newContainerWidth = container.offsetWidth;
      const totalPreviousWidth = paneWidths.reduce((a, b) => a + b, 0);
      const scale = newContainerWidth / totalPreviousWidth;
      const newPaneWidths = paneWidths.map((width) => width * scale);

      setPaneWidths(newPaneWidths);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [paneWidths]);

  return (
    <div
      className={cn(className, "flex flex-grow relative")}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {children.map((child, index) => (
        <Fragment key={index}>
          <div style={{ width: `${paneWidths[index]}px` }}>{child}</div>
          {index < children.length - 1 && (
            <div
              className="cursor-ew-resize bg-transparent absolute z-10 h-full w-2"
              style={{
                left: `${
                  paneWidths.slice(0, index + 1).reduce((a, b) => a + b, 0) - 5
                }px`,
              }}
              onMouseDown={() => handleMouseDown(index)}
              onDoubleClick={() => handleDoubleClick(index)}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export { SplitPane };
