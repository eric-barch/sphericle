import { AreaState, LocationType, PointState, Quiz } from "@/types";
import Area from "./Area";
import LocationAdder from "./LocationAdder";
import Point from "./Point";

interface SublocationsProps {
  className?: string;
  parentState: Quiz | AreaState;
  setParentState: (parentState: Quiz | AreaState) => void;
  setDisplayedLocation: (location: AreaState | PointState | null) => void;
  setParentOutlined: (outlined: boolean) => void;
}

export function Sublocations({
  className,
  parentState,
  setParentState,
  setDisplayedLocation,
  setParentOutlined,
}: SublocationsProps) {
  const sublocations = parentState.sublocations;
  function setSublocations(sublocations: (AreaState | PointState)[]) {
    const newParentState = { ...parentState, sublocations };
    setParentState(newParentState);
  }

  function setSublocation(sublocation) {
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

  function toggleSublocationOpen(sublocation: AreaState) {
    return () => {
      const newSublocation = { ...sublocation, open: !sublocation.open };
      setSublocation(sublocation)(newSublocation);
    };
  }

  function addSublocation(sublocation: AreaState | PointState) {
    const newSublocations = [...sublocations, sublocation];
    setSublocations(newSublocations);
  }

  function deleteSublocation(sublocation: AreaState | PointState) {
    return () => {
      const newSublocations = sublocations.filter(
        (subloc) => subloc !== sublocation,
      );
      setSublocations(newSublocations);
    };
  }

  function renameSublocation(sublocation: AreaState | PointState) {
    return (name: string) => {
      const newSublocation = { ...sublocation, userDefinedName: name };
      setSublocation(sublocation)(newSublocation);
    };
  }

  return (
    <div className={`${className ? className : ""} space-y-1 h-full`}>
      {parentState.sublocations.map((sublocation) => {
        if (sublocation.locationType === LocationType.Area) {
          return (
            <Area
              key={sublocation.placeId}
              areaState={sublocation}
              setAreaState={setSublocation(sublocation)}
              onToggleOpen={toggleSublocationOpen(sublocation)}
              onDelete={deleteSublocation(sublocation)}
              rename={renameSublocation(sublocation)}
              onDisplay={() => setDisplayedLocation(sublocation)}
            />
          );
        }

        if (sublocation.locationType === LocationType.Point) {
          return (
            <Point
              key={sublocation.placeId}
              pointState={sublocation}
              onDisplay={() => setDisplayedLocation(sublocation)}
              onDelete={() => deleteSublocation(sublocation)}
              rename={renameSublocation(sublocation)}
            />
          );
        }

        return null;
      })}
      <LocationAdder
        parentState={parentState}
        addLocation={addSublocation}
        setDisplayedLocation={setDisplayedLocation}
        setParentOutlined={setParentOutlined}
      />
    </div>
  );
}
