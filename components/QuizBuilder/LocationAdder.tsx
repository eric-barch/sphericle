"use client";

import usePointSearch from "@/hooks/use-point-search.hook";
import {
  Area,
  Coordinate,
  LocationType,
  OpenStreetMapArea,
  Point,
  Polygon,
} from "@/types";
import { Combobox } from "@headlessui/react";
import { useEffect, useState } from "react";
import LocationAdderInput from "./LocationAdderInput";
import LocationAdderOptions from "./LocationAdderOptions";

interface LocationAdderProps {
  parentLocationType: LocationType;
  parentLocationName: string | null;
}

export default function LocationAdder({
  parentLocationType,
  parentLocationName,
}: LocationAdderProps) {
  const [locationAdderLocationType, setLocationAdderLocationType] =
    useState<LocationType>(LocationType.Area);
  const [input, setInput] = useState<string>("");
  // const { areaOptions, setOpenStreetMapSearchTerm } = useOpenStreetMap();
  const { searchResults: pointOptions, setSearchTerm: setPointSearchTerm } =
    usePointSearch();

  // function getComponentPolygons(array: any[]): Polygon[] {
  //   let polygons: Polygon[] = [];

  //   for (const item of array) {
  //     if (typeof item[0][0] === "number") {
  //       const coordinates = item.map(
  //         (point: number[]): Coordinate => ({
  //           lat: point[1],
  //           lng: point[0],
  //         }),
  //       );

  //       polygons.push({
  //         id: crypto.randomUUID(),
  //         coordinates,
  //       });
  //     } else {
  //       const subPolygons = getComponentPolygons(item);
  //       polygons.push(...subPolygons);
  //     }
  //   }

  //   return polygons;
  // }

  // function convertOsmResponseItemToAreaLocationState(
  //   osmResponseItem: OpenStreetMapArea,
  // ): Area {
  //   const componentPolygons = getComponentPolygons(
  //     osmResponseItem.geojson.coordinates,
  //   );

  //   return {
  //     locationType: LocationType.Area,
  //     placeId: osmResponseItem.place_id,
  //     fullName: osmResponseItem.name,
  //     displayName: osmResponseItem.display_name,
  //     isQuizQuestion: true,
  //     isOpen: false,
  //     subLocationStates: [],
  //     componentPolygons,
  //   };
  // }

  // async function searchAreas(input: string) {
  //   setAreaOptions({ searchTerm: input, options: null });

  //   const url = `/api/search-areas?query=${input}`;
  //   const response = await fetch(url);
  //   const osmResponseItems = (await response.json()) as OpenStreetMapArea[];

  //   const options = osmResponseItems
  //     .map((osmResponseItem) => {
  //       try {
  //         return convertOsmResponseItemToAreaLocationState(osmResponseItem);
  //       } catch (error) {
  //         return null;
  //       }
  //     })
  //     .filter((item): item is Area => item !== null);

  //   setAreaOptions({ searchTerm: input, options });
  // }

  // function searchPoints(input: string) {
  //   setGooglePlacesSearchTerm(input);
  // }

  // function convertAutocompletePredictionToPointLocationState(
  //   prediction: GooglePlacePrediction,
  // ) {
  //   return {
  //     locationType: LocationType.Point,
  //     placeId: prediction.place_id,
  //     displayName: prediction.description,
  //     fullName: prediction.description,
  //     position: prediction.position,
  //   };
  // }

  // TODO: think I can and should refactor out this useEffect
  /**What does this useEffect actually do? When the predictions returned by usePlacesAutocomplete change,
   * we convert the PlacesAutocomplete response object (plus location data from Geocoder) into a
   * PointState, which is just the internal data we need for the program.
   *
   * - Can I accomplish this within the hook itself?  */
  // useEffect(() => {
  //   const options = areaOptions.predictions
  //     ?.map((prediction) => {
  //       try {
  //         return convertAutocompletePredictionToPointLocationState(prediction);
  //       } catch (error) {
  //         return null;
  //       }
  //     })
  //     .filter((item): item is Point => item !== null);

  //   if (options) {
  //     setPointOptions({ searchTerm: areaOptions.searchTerm, options });
  //   }
  // }, [areaOptions]);

  // useEffect(() => {
  //   console.log("areaOptions");
  //   console.log(areaOptions);
  // }, [areaOptions]);

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
        // areaOptions={areaOptions}
        setGooglePlacesSearchTerm={setPointSearchTerm}
        // setOpenStreetMapSearchTerm={setOpenStreetMapSearchTerm}
      />
      <LocationAdderOptions
        locationAdderLocationType={locationAdderLocationType}
        input={input}
        // areaOptions={areaOptions}
        pointOptions={pointOptions}
      />
    </Combobox>
  );
}
