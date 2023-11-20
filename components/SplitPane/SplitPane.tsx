import React, { useCallback, useState, useEffect, useRef } from "react";

interface SplitPaneProps {
  children: React.ReactNode | React.ReactNode[];
}

export default function SplitPane({ children }: SplitPaneProps) {
  const childrenArray = Array.isArray(children) ? children : [children];

  const containerRef = useRef<HTMLDivElement>(null);
  const [prevContainerWidth, setPrevContainerWidth] = useState<number>(0);
  const [paneWidths, setPaneWidths] = useState<number[]>([]);
  const [isResizing, setIsResizing] = useState(false);
  const [currentPaneIndex, setCurrentPaneIndex] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const newContainerWidth = containerRef.current.offsetWidth;
      setPaneWidths(
        Array.from(
          { length: childrenArray.length },
          () => newContainerWidth / childrenArray.length,
        ),
      );
      setPrevContainerWidth(newContainerWidth);
    }
  }, []);

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
  }, [childrenArray.length, prevContainerWidth, paneWidths]);

  const handleMouseDown = useCallback((index: number) => {
    setIsResizing(true);
    setCurrentPaneIndex(index);
  }, []);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
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
    },
    [isResizing, paneWidths, currentPaneIndex],
  );

  const handleDoubleClick = useCallback(
    (index: number) => {
      const newPaneWidths = [...paneWidths];
      newPaneWidths[index] = newPaneWidths[index + 1] =
        (paneWidths[index] + paneWidths[index + 1]) / 2;
      setPaneWidths(newPaneWidths);
    },
    [paneWidths],
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  return (
    <div
      className="flex flex-grow relative"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {childrenArray.map((child, index) => (
        <React.Fragment key={index}>
          <div style={{ width: `${paneWidths[index]}px` }}>{child}</div>
          {index < childrenArray.length - 1 && (
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
        </React.Fragment>
      ))}
    </div>
  );
}
