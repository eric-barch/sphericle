import { isArea, isParent, isEarth } from "@/helpers";
import { useAutocompleteService } from "@/hooks/use-autocomplete-service.hook";
import { useGeocodingService } from "@/hooks/use-geocoding-service.hook";
import { useQuiz } from "@/providers";
import { FeatureType, PointSearch, PointState, SearchStatus } from "@/types";
import booleanIntersects from "@turf/boolean-intersects";
import { Point } from "geojson";
import { useState } from "react";

const usePointSearch = (parentFeatureId: string): PointSearch => {
  const { autocompleteService } = useAutocompleteService();
  const { geocodingService } = useGeocodingService();
  const { quiz } = useQuiz();

  const parentFeatureState = (() => {
    const parentFeatureState = quiz.get(parentFeatureId);

    if (isParent(parentFeatureState)) {
      return parentFeatureState;
    }
  })();
  const displayBoundsBuffer = 0.1;

  const [debounceTimeoutId, setDebounceTimeoutId] =
    useState<NodeJS.Timeout>(null);
  const [termRaw, setTermRaw] = useState<string>("");
  const [statusRaw, setStatusRaw] = useState<SearchStatus>(
    SearchStatus.INITIALIZED,
  );
  const [resultsRaw, setResultsRaw] = useState<PointState[]>([]);

  const toPoint = async (
    autocompletePrediction: google.maps.places.AutocompletePrediction,
  ): Promise<Point> => {
    const geocoderResult = (
      await geocodingService.geocode({
        placeId: autocompletePrediction.place_id,
      })
    ).results[0];

    const lat = geocoderResult.geometry.location.lat();
    const lng = geocoderResult.geometry.location.lng();

    const point: Point = { type: "Point", coordinates: [lng, lat] };

    if (isEarth(parentFeatureState)) {
      return point;
    }

    if (isArea(parentFeatureState)) {
      const parentPolygons = parentFeatureState.polygon;

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
      id: crypto.randomUUID(),
      parentId: parentFeatureId,
      googleId: autocompletePrediction.place_id,
      longName: autocompletePrediction.description,
      shortName: autocompletePrediction.description.split(",")[0],
      userDefinedName: null,
      type: FeatureType.POINT,
      displayBounds,
      point,
    };
  };

  const search = async (searchTerm: string) => {
    setTermRaw(searchTerm);
    setStatusRaw(SearchStatus.SEARCHING);

    const request = {
      input: searchTerm,
      locationRestriction: isArea(parentFeatureState)
        ? parentFeatureState.searchBounds
        : undefined,
    };

    const response = await autocompleteService.getPlacePredictions(request);

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
};

export { usePointSearch };
