import { useQuiz, useSetQuiz } from "@/components/QuizProvider";
import { AreaState, LocationType, PointState, Quiz } from "@/types";
import { Reorder } from "framer-motion";
import Area from "./Area";
import LocationAdder from "./LocationAdder";
import Point from "./Point";

interface SublocationsProps {
  className?: string;
  parentState: Quiz | AreaState;
  setParentState: (parentState: Quiz | AreaState) => void;
}

export function Sublocations({
  className,
  parentState,
  setParentState,
}: SublocationsProps) {
  const quiz = useQuiz();
  const setQuiz = useSetQuiz();

  const sublocations = parentState.sublocations;
  function setSublocations(sublocations: (AreaState | PointState)[]) {
    const newParentState = { ...parentState, sublocations };
    setParentState(newParentState);
  }

  function useSetSublocation(sublocation: AreaState | PointState) {
    return (newSublocation: AreaState | PointState) => {
      const index = sublocations.findIndex((subloc) => subloc === sublocation);

      if (index < 0) {
        return;
      }

      const newSublocations = [...sublocations];
      newSublocations[index] = newSublocation;
      setSublocations(newSublocations);
    };
  }

  function useSetSublocationAndQuiz(sublocation: AreaState | PointState) {
    return (newSublocation: AreaState | PointState) => {
      const index = sublocations.findIndex((subloc) => subloc === sublocation);

      if (index < 0) {
        return;
      }

      const newSublocations = [...sublocations];
      newSublocations[index] = newSublocation;
      const newParentState = { ...parentState, sublocations: newSublocations };
      setParentState(newParentState);

      setQuiz({ ...quiz, selectedSublocation: newSublocation });
    };
  }

  function useToggleSublocationOpen(sublocation: AreaState | PointState) {
    if (sublocation.locationType !== LocationType.Area) {
      return;
    }

    return () => {
      const newSublocation: AreaState = {
        ...sublocation,
        open: !sublocation.open,
      };

      useSetSublocationAndQuiz(sublocation)(newSublocation);
    };
  }

  function useRenameSublocation(sublocation: AreaState | PointState) {
    return (name: string) => {
      const newSublocation = { ...sublocation, userDefinedName: name };
      useSetSublocation(sublocation)(newSublocation);
    };
  }

  function useDeleteSublocation(sublocation: AreaState | PointState) {
    return () => {
      const newSublocations = sublocations.filter(
        (subloc) => subloc !== sublocation,
      );
      setSublocations(newSublocations);
    };
  }

  function addSublocation(sublocation: AreaState | PointState) {
    const newSublocations = [...sublocations, sublocation];
    setSublocations(newSublocations);
  }

  return (
    <div className={`${className ? className : ""} space-y-1 h-full`}>
      <Reorder.Group
        className="mt-1 space-y-1"
        axis="y"
        values={sublocations}
        onReorder={setSublocations}
      >
        {sublocations.map((sublocation) => (
          <Reorder.Item
            key={sublocation.placeId}
            layout="position"
            layoutScroll
            value={sublocation}
          >
            <Sublocation
              sublocation={sublocation}
              setSublocation={useSetSublocation(sublocation)}
              onToggleOpen={useToggleSublocationOpen(sublocation)}
              rename={useRenameSublocation(sublocation)}
              onDelete={useDeleteSublocation(sublocation)}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <LocationAdder parentState={parentState} addLocation={addSublocation} />
    </div>
  );
}

interface SublocationProps {
  sublocation: AreaState | PointState;
  setSublocation: (sublocation: AreaState | PointState) => void;
  onToggleOpen: () => void;
  rename: (name: string) => void;
  onDelete: () => void;
}

function Sublocation({
  sublocation,
  setSublocation,
  onToggleOpen,
  rename,
  onDelete,
}: SublocationProps) {
  if (sublocation.locationType === LocationType.Area) {
    return (
      <Area
        key={sublocation.placeId}
        areaState={sublocation}
        setAreaState={setSublocation}
        onToggleOpen={onToggleOpen}
        rename={rename}
        onDelete={onDelete}
      />
    );
  }

  if (sublocation.locationType === LocationType.Point) {
    return (
      <Point
        key={sublocation.placeId}
        pointState={sublocation}
        rename={rename}
        onDelete={onDelete}
      />
    );
  }

  return null;
}
