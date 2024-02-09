"use client";

import { isArea, isRoot } from "@/helpers";
import { useQuizBuilder } from "@/providers";
import {
  AreaSearch,
  FeatureType,
  ParentFeature,
  PointSearch,
  QuizBuilderDispatchType,
  SearchStatus,
} from "@/types";
import { Combobox } from "@headlessui/react";
import { Grid2X2, MapPin } from "lucide-react";
import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  RefObject,
  forwardRef,
} from "react";

type AdderInputProps = {
  feature: ParentFeature;
  selectParentOnInput: boolean;
  input: string;
  featureType: FeatureType;
  featureAdderRef: RefObject<HTMLDivElement>;
  areaSearch: AreaSearch;
  pointSearch: PointSearch;
  setFeatureType: (featureType: FeatureType) => void;
  setInput: (input: string) => void;
};

const AdderInput = forwardRef(
  (props: AdderInputProps, ref: RefObject<HTMLInputElement>) => {
    const {
      feature,
      selectParentOnInput,
      input,
      featureType,
      featureAdderRef,
      areaSearch,
      pointSearch,
      setFeatureType,
      setInput,
    } = props;

    const { quizBuilder, quizBuilderDispatch } = useQuizBuilder();

    const isSelected = feature.id === quizBuilder.selectedId;
    const name = (() => {
      if (isRoot(feature)) return "root";
      if (isArea(feature)) return feature.userDefinedName || feature.shortName;
    })();
    const placeholder = (() => {
      if (isRoot(feature)) return `Add ${featureType.toLowerCase()} anywhere`;
      if (isArea(feature)) return `Add ${featureType.toLowerCase()} in ${name}`;
    })();

    const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
      if (featureAdderRef.current?.contains(event.relatedTarget)) {
        /**Prevent losing input when focus moves between subcomponents of
         * Adder. Necessary to work around built-in HeadlessUI Combobox
         * behavior. */
        event.preventDefault();
        return;
      }

      areaSearch.reset();
      pointSearch.reset();
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      setInput(event.target.value);

      if (!isSelected && selectParentOnInput) {
        quizBuilderDispatch({
          type: QuizBuilderDispatchType.SET_SELECTED,
          featureId: feature.id,
        });
      }

      if (featureType === FeatureType.POINT) {
        pointSearch.setTerm(event.target.value);
      }
    };

    const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
      if (
        featureType === FeatureType.AREA &&
        areaSearch.status !== SearchStatus.SEARCHED
      ) {
        event.preventDefault();
        return;
      }

      if (
        featureType === FeatureType.POINT &&
        (pointSearch.status !== SearchStatus.SEARCHED ||
          pointSearch.results.length === 0)
      ) {
        event.preventDefault();
        return;
      }

      if (featureType === FeatureType.AREA && input !== areaSearch.term) {
        event.preventDefault();
        areaSearch.setTerm(input);
      }
    };

    const handleTab = (event: KeyboardEvent<HTMLInputElement>) => {
      /**Override undesirable built-in HeadlessUI Combobox Tab advance behavior.
       * Look into alternative accessible libraries, or wait for Radix to come
       * out with one. */
      event.preventDefault();

      const focusableElements = Array.from(
        document.querySelectorAll(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      );
      const currentIndex = focusableElements.indexOf(event.currentTarget);

      if (event.shiftKey) {
        const previousElement =
          focusableElements[currentIndex - 1] ||
          focusableElements[focusableElements.length - 1];
        (previousElement as HTMLElement).focus();
      } else {
        const nextElement =
          focusableElements[currentIndex + 1] || focusableElements[0];
        (nextElement as HTMLElement).focus();
      }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Tab") {
        handleTab(event);
      }

      if (event.key === "Enter") {
        handleEnter(event);
      }
    };

    return (
      <div className="relative">
        <ChangeFeatureTypeButton
          featureType={featureType}
          setFeatureType={setFeatureType}
        />
        <Combobox.Input
          ref={ref}
          className="w-full p-1 rounded-3xl text-left bg-transparent border-2 border-gray-300 pl-8 pr-3 text-ellipsis focus:outline-none"
          placeholder={placeholder}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    );
  },
);

AdderInput.displayName = "FeatureAdderInput";

type ChangeFeatureTypeButtonProps = {
  featureType: FeatureType;
  setFeatureType: (featureType: FeatureType) => void;
};

const ChangeFeatureTypeButton = ({
  featureType,
  setFeatureType,
}: ChangeFeatureTypeButtonProps) => {
  const handleClick = () => {
    /**TODO: Make this some kind of circular linked list. */
    if (featureType === FeatureType.AREA) setFeatureType(FeatureType.POINT);
    if (featureType === FeatureType.POINT) setFeatureType(FeatureType.AREA);
  };

  return (
    <button
      className="flex h-6 w-6 items-center justify-center absolute top-1/2 transform -translate-y-1/2 rounded-2xl left-1.5 bg-gray-600 text-gray-300 "
      onClick={handleClick}
    >
      {(() => {
        switch (featureType) {
          case FeatureType.AREA:
            return <Grid2X2 className="w-4 h-4" />;
          case FeatureType.POINT:
            return <MapPin className="w-4 h-4" />;
        }
      })()}
    </button>
  );
};

export { AdderInput };
