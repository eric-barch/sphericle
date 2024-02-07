"use client";

// TODO: this really needs to be refactored

import {
  Fragment,
  MouseEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

interface SplitPaneProps {
  children: ReactNode[];
}

function SplitPane({ children }: SplitPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [prevContainerWidth, setPrevContainerWidth] = useState<number>(0);
  const [paneWidths, setPaneWidths] = useState<number[]>([]);
  const [isResizing, setIsResizing] = useState(false);
  const [currentPaneIndex, setCurrentPaneIndex] = useState(0);

  const handleMouseDown = (index: number) => {
    setIsResizing(true);
    setCurrentPaneIndex(index);
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!isResizing) return;

    const leftPanesWidth = paneWidths
      .slice(0, currentPaneIndex)
      .reduce((a, b) => a + b, 0);
    const middlePanesWidth =
      paneWidths[currentPaneIndex] + paneWidths[currentPaneIndex + 1];

    const newPaneWidths = [...paneWidths];

    if (event.clientX < leftPanesWidth) {
      newPaneWidths[currentPaneIndex] = 0;
      newPaneWidths[currentPaneIndex + 1] = middlePanesWidth;
    } else if (event.clientX > leftPanesWidth + middlePanesWidth) {
      newPaneWidths[currentPaneIndex] = middlePanesWidth;
      newPaneWidths[currentPaneIndex + 1] = 0;
    } else {
      newPaneWidths[currentPaneIndex] = event.clientX - leftPanesWidth;
      newPaneWidths[currentPaneIndex + 1] =
        middlePanesWidth - newPaneWidths[currentPaneIndex];
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
    if (containerRef.current) {
      const newContainerWidth = containerRef.current.offsetWidth;
      setPaneWidths(
        Array.from(
          { length: children.length },
          () => newContainerWidth / children.length,
        ),
      );
      setPrevContainerWidth(newContainerWidth);
    }
  }, [children.length]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const newContainerWidth = containerRef.current.offsetWidth;
        const paneRatios = paneWidths.map(
          (width) => width / prevContainerWidth,
        );
        setPaneWidths(paneRatios.map((ratio) => ratio * newContainerWidth));
        setPrevContainerWidth(newContainerWidth);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [children.length, prevContainerWidth, paneWidths]);

  return (
    <div
      className="flex flex-grow relative"
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
}

export { SplitPane };
