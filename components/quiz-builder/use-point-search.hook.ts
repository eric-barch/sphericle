import { useAllFeatures } from "@/components/all-features-provider";
import {
  isAreaState,
  isParentFeatureState,
  isRootState,
} from "@/helpers/feature-type-guards";
import { FeatureType, PointSearch, PointState, SearchStatus } from "@/types";
import booleanIntersects from "@turf/boolean-intersects";
import { Point } from "geojson";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";

function usePointSearch(parentFeatureId: string): PointSearch {
  const { allFeatures } = useAllFeatures();

  const parentFeatureState = (() => {
    const initialParentFeatureState = allFeatures.get(parentFeatureId);

    if (isParentFeatureState(initialParentFeatureState)) {
      return initialParentFeatureState;
    }
  })();
  const displayBoundsBuffer = 0.1;

  const autocompleteServiceRef = useRef(window.autocompleteService);
  const geocoderRef = useRef(window.geocoder);

  const [termRaw, setTermRaw] = useState<string>("");
  const [statusRaw, setStatusRaw] = useState<SearchStatus>(
    SearchStatus.SEARCHED,
  );
  const [resultsRaw, setResultsRaw] = useState<PointState[]>([]);

  // // // TODO: Feel like this should maybe be loaded at the app level
  // useEffect(() => {
  //   const mapsLibrary = window.google.maps;

  //   if (!mapsLibrary) {
  //     console.error("Did not find Google Maps library.");
  //     return;
  //   }

  //   if (!autocompleteServiceRef.current) {
  //     const placesLibrary = mapsLibrary.places;

  //     if (!placesLibrary) {
  //       console.error("Did not find Google Places library.");
  //       return;
  //     }

  //     autocompleteServiceRef.current = new placesLibrary.AutocompleteService();
  //   }

  //   if (!geocoderRef.current) {
  //     geocoderRef.current = new mapsLibrary.Geocoder();
  //   }
  // }, []);

  const toPoint = async (
    autocompletePrediction: google.maps.places.AutocompletePrediction,
  ): Promise<Point> => {
    const geocoderResult = (
      await geocoderRef.current.geocode({
        placeId: autocompletePrediction.place_id,
      })
    ).results[0];

    const lat = geocoderResult.geometry.location.lat();
    const lng = geocoderResult.geometry.location.lng();

    const point: Point = { type: "Point", coordinates: [lng, lat] };

    if (isRootState(parentFeatureState)) {
      return point;
    }

    if (isAreaState(parentFeatureState)) {
      const parentPolygons = parentFeatureState.polygons;

      if (booleanIntersects(point, parentPolygons)) {
        return point;
      }
    }
  };

  const toPointState = async (
    autocompletePrediction: google.maps.places.AutocompletePrediction,
  ): Promise<PointState> => {
    const point = await toPoint(autocompletePrediction);

    if (!point) {
      return;
    }

    const displayBounds = {
      north: point.coordinates[1] + displayBoundsBuffer,
      south: point.coordinates[1] - displayBoundsBuffer,
      east: point.coordinates[0] + displayBoundsBuffer,
      west: point.coordinates[0] - displayBoundsBuffer,
    };

    return {
      featureId: crypto.randomUUID(),
      parentFeatureId: parentFeatureId,
      googlePlacesId: autocompletePrediction.place_id,
      longName: autocompletePrediction.description,
      shortName: autocompletePrediction.description.split(",")[0],
      userDefinedName: null,
      featureType: FeatureType.POINT,
      displayBounds,
      point,
    };
  };

  const search = useCallback(
    debounce(async (searchTerm: string) => {
      console.log("search");

      if (!autocompleteServiceRef.current || !geocoderRef.current) {
        console.log("return");
        return;
      }

      setTermRaw(searchTerm);
      setStatusRaw(SearchStatus.SEARCHING);

      const request = {
        input: searchTerm,
        locationRestriction: isAreaState(parentFeatureState)
          ? parentFeatureState.searchBounds
          : undefined,
      };

      const response =
        await autocompleteServiceRef.current.getPlacePredictions(request);

      const results = (
        await Promise.all(
          response.predictions.map(
            async (prediction) => await toPointState(prediction),
          ),
        )
      ).filter((result) => result);

      setResultsRaw(results);
      setStatusRaw(SearchStatus.SEARCHED);
    }, 500),
    [],
  );

  const setSearchTerm = (searchTerm: string) => {
    console.log("setSearchTerm", searchTerm);

    if (searchTerm !== "") {
      search(searchTerm);
    } else {
      reset();
    }
  };

  const reset = () => {
    setTermRaw("");
    setStatusRaw(SearchStatus.SEARCHED);
    setResultsRaw([]);
  };

  return {
    term: termRaw,
    status: statusRaw,
    results: resultsRaw,
    setTerm: setSearchTerm,
    reset,
  };
}

export { usePointSearch };
