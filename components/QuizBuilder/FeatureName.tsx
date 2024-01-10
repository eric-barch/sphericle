import { AllFeaturesDispatchType, FeatureType } from "@/types";
import { KeyboardEvent, RefObject, useState } from "react";
import { useAllFeatures } from "../AllFeaturesProvider";

interface LocationNameProps {
  inputRef: RefObject<HTMLInputElement>;
  featureId: string;
  isRenaming: boolean;
  setIsRenaming: (isRenaming: boolean) => void;
}

export default function LocationName({
  inputRef,
  featureId,
  isRenaming,
  setIsRenaming,
}: LocationNameProps) {
  const { allFeatures, allFeaturesDispatch } = useAllFeatures();

  const feature = allFeatures.get(featureId);

  if (
    feature.featureType !== FeatureType.AREA &&
    feature.featureType !== FeatureType.POINT
  ) {
    throw new Error("feature must be of type AREA or POINT.");
  }

  const displayName = feature.userDefinedName || feature.shortName;

  const [input, setInput] = useState<string>(displayName);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      setIsRenaming(false);

      allFeaturesDispatch({
        type: AllFeaturesDispatchType.RENAME_FEATURE,
        featureId,
        name: input,
      });
    }

    if (event.key === "Escape") {
      event.currentTarget.blur();
    }
  }

  function handleKeyUp(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === " ") {
      // stop from toggling Radix Accordion
      event.preventDefault();
    }
  }

  function handleBlur() {
    setInput(displayName);
    setIsRenaming(false);
  }

  return (
    <div className="flex-grow min-w-0 px-7 overflow-hidden text-ellipsis whitespace-nowrap">
      {isRenaming ? (
        <input
          ref={inputRef}
          className="bg-transparent w-full focus:outline-none"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
        />
      ) : (
        <>{displayName}</>
      )}
    </div>
  );
}
