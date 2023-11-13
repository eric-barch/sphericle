import React, { useCallback, useState } from "react";

interface SplitPaneProps {
  children: React.ReactNode | React.ReactNode[];
}

export default function SplitPane({ children }: SplitPaneProps) {
  const childrenArray = Array.isArray(children) ? children : [children];

  const initialPaneWidths = Array.from(
    { length: childrenArray.length },
    () => window.innerWidth / childrenArray.length,
  );
  const [paneWidths, setPaneWidths] = useState(initialPaneWidths);
  const [isResizing, setIsResizing] = useState(false);
  const [currentPaneIndex, setCurrentPaneIndex] = useState(0);

  const handleMouseDown = useCallback((index: number) => {
    setIsResizing(true);
    setCurrentPaneIndex(index);
  }, []);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (isResizing) {
        const leftStaticPanesWidth = paneWidths
          .slice(0, currentPaneIndex)
          .reduce((accumulator, currentWidth) => accumulator + currentWidth, 0);
        let leftResizingPaneWidth = paneWidths[currentPaneIndex];
        let rightResizingPaneWidth = paneWidths[currentPaneIndex + 1];
        const resizingPanesWidth =
          leftResizingPaneWidth + rightResizingPaneWidth;
        const rightStaticPanesWidth = paneWidths
          .slice(currentPaneIndex + 2)
          .reduce((accumulator, currentWidth) => accumulator + currentWidth, 0);

        if (
          event.clientX >= leftStaticPanesWidth &&
          event.clientX <= leftStaticPanesWidth + resizingPanesWidth
        ) {
          leftResizingPaneWidth = event.clientX - leftStaticPanesWidth;
          rightResizingPaneWidth = resizingPanesWidth - leftResizingPaneWidth;
        }

        const newPaneWidths = [...paneWidths];
        newPaneWidths[currentPaneIndex] = leftResizingPaneWidth;
        newPaneWidths[currentPaneIndex + 1] = rightResizingPaneWidth;

        setPaneWidths(newPaneWidths);
      }
    },
    [isResizing, paneWidths, currentPaneIndex],
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  return (
    <div
      className="flex flex-grow relative"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {childrenArray.map((child, index) => (
        <React.Fragment key={index}>
          <div style={{ width: `${paneWidths[index]}px`, flexShrink: 0 }}>
            {child}
          </div>
          {index < childrenArray.length - 1 && (
            <div
              className="cursor-ew-resize bg-transparent absolute z-10"
              style={{
                height: "100%",
                width: "10px",
                left: `${
                  paneWidths.slice(0, index + 1).reduce((a, b) => a + b, 0) - 5
                }px`,
              }}
              onMouseDown={() => handleMouseDown(index)}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
