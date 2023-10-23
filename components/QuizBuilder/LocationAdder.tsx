"use client";

import usePlacesAutocomplete from "@/hooks/use-places-autocomplete.hook";
import { Combobox } from "@headlessui/react";
import { useEffect, useState } from "react";
import LocationAdderInput from "./LocationAdderInput";
import LocationAdderOptions from "./LocationAdderOptions";
import {
  AreaOptionsState,
  AreaState,
  Coordinate,
  LocationType,
  OsmResponseItem,
  PointOptionsState,
  PointState,
  Polygon,
  Prediction,
} from "./types";

type AutocompletePrediction = google.maps.places.AutocompletePrediction;

interface LocationAdderProps {
  parentLocationType: LocationType;
  parentLocationName: string | null;
}

export default function LocationAdder({
  parentLocationType,
  parentLocationName,
}: LocationAdderProps) {
  const {
    searchTerm,
    predictions,
    setSearchTerm,
    clearAutocompletePredictions,
  } = usePlacesAutocomplete();

  const [locationAdderLocationType, setLocationAdderLocationType] =
    useState<LocationType>(LocationType.Area);
  const [input, setInput] = useState<string>("");
  const [areaOptions, setAreaOptions] = useState<AreaOptionsState>({
    searchTerm: "",
    options: [],
  });
  const [pointOptions, setPointOptions] = useState<PointOptionsState>({
    searchTerm: "",
    options: [],
  });

  function getComponentPolygons(array: any[]): Polygon[] {
    let polygons: Polygon[] = [];

    for (const item of array) {
      if (typeof item[0][0] === "number") {
        const coordinates = item.map(
          (point: number[]): Coordinate => ({
            lat: point[1],
            lng: point[0],
          }),
        );

        polygons.push({
          id: crypto.randomUUID(),
          coordinates,
        });
      } else {
        const subPolygons = getComponentPolygons(item);
        polygons.push(...subPolygons);
      }
    }

    return polygons;
  }

  function convertOsmResponseItemToAreaLocationState(
    osmResponseItem: OsmResponseItem,
  ): AreaState {
    const componentPolygons = getComponentPolygons(
      osmResponseItem.geojson.coordinates,
    );

    return {
      locationType: LocationType.Area,
      placeId: osmResponseItem.place_id,
      fullName: osmResponseItem.name,
      displayName: osmResponseItem.display_name,
      isQuizQuestion: true,
      isOpen: false,
      subLocationStates: [],
      componentPolygons,
    };
  }

  async function searchAreas(input: string) {
    setAreaOptions({ searchTerm: input, options: null });

    const url = `/api/search-areas?query=${input}`;
    const response = await fetch(url);
    const osmResponseItems = (await response.json()) as OsmResponseItem[];

    const options = osmResponseItems
      .map((osmResponseItem) => {
        try {
          return convertOsmResponseItemToAreaLocationState(osmResponseItem);
        } catch (error) {
          return null;
        }
      })
      .filter((item): item is AreaState => item !== null);

    setAreaOptions({ searchTerm: input, options });
  }

  function searchPoints(input: string) {
    setSearchTerm(input);
  }

  function convertAutocompletePredictionToPointLocationState(
    prediction: Prediction,
  ) {
    return {
      locationType: LocationType.Point,
      placeId: prediction.place_id,
      displayName: prediction.description,
      fullName: prediction.description,
      position: prediction.position,
    };
  }

  // TODO: think I can and should refactor out this useEffect.
  useEffect(() => {
    const options = predictions.predictions
      ?.map((prediction) => {
        try {
          return convertAutocompletePredictionToPointLocationState(prediction);
        } catch (error) {
          return null;
        }
      })
      .filter((item): item is PointState => item !== null);

    if (options) {
      setPointOptions({ searchTerm: predictions.searchTerm, options });
    }
  }, [predictions]);

  useEffect(() => {
    console.log("areaOptions");
    console.log(areaOptions);
  }, [areaOptions]);

  useEffect(() => {
    console.log("pointOptions");
    console.log(pointOptions);
  }, [pointOptions]);

  return (
    <Combobox>
      <LocationAdderInput
        parentLocationType={parentLocationType}
        parentLocationName={parentLocationName}
        locationAdderLocationType={locationAdderLocationType}
        setLocationAdderLocationType={setLocationAdderLocationType}
        input={input}
        setInput={setInput}
        areaOptions={areaOptions}
        searchAreas={searchAreas}
        searchPoints={searchPoints}
      />
      <LocationAdderOptions
        locationAdderLocationType={locationAdderLocationType}
        input={input}
        areaOptions={areaOptions}
        pointOptions={pointOptions}
      />
    </Combobox>
  );
}
