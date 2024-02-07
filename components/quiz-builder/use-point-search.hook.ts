import { useAllFeatures } from "@/components/quiz-provider";
import {
  isAreaState,
  isParentFeatureState,
  isRootState,
} from "@/helpers/state.helpers";
import { FeatureType, PointSearch, PointState, SearchStatus } from "@/types";
import booleanIntersects from "@turf/boolean-intersects";
import { Point } from "geojson";
import { useRef, useState } from "react";

function usePointSearch(parentFeatureId: string): PointSearch {
  const { allFeatures } = useAllFeatures();

  const parentFeatureState = (() => {
    const parentFeatureState = allFeatures.get(parentFeatureId);

    if (isParentFeatureState(parentFeatureState)) {
      return parentFeatureState;
    }
  })();
  const displayBoundsBuffer = 0.1;

  const autocompleteServiceRef = useRef(window.autocompleteService);
  const geocoderRef = useRef(window.geocoder);

  const [debounceTimeoutId, setDebounceTimeoutId] =
    useState<NodeJS.Timeout>(null);
  const [termRaw, setTermRaw] = useState<string>("");
  const [statusRaw, setStatusRaw] = useState<SearchStatus>(
    SearchStatus.SEARCHED,
  );
  const [resultsRaw, setResultsRaw] = useState<PointState[]>([]);

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

  const search = async (searchTerm: string) => {
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
  };

  const setTerm = (searchTerm: string) => {
    if (searchTerm === "") {
      reset();
      return;
    }

    if (debounceTimeoutId) {
      clearTimeout(debounceTimeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      search(searchTerm);
    }, 500);

    setDebounceTimeoutId(newTimeoutId);
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
    setTerm,
    reset,
  };
}

export { usePointSearch };
