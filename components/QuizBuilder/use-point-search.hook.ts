import { useQuiz } from "@/components/QuizProvider";
import {
  AreaState,
  FeatureType,
  PointState,
  RootState,
  SearchStatus,
} from "@/types";
import booleanIntersects from "@turf/boolean-intersects";
import { Point } from "geojson";
import { debounce } from "lodash";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";

export interface PointSearch {
  term: string;
  status: SearchStatus;
  results: PointState[];
  setTerm: (searchTerm: string) => void;
  reset: () => void;
}

export default function usePointSearch(parentId: string): PointSearch {
  const quiz = useQuiz();
  const parentLocation = quiz[parentId] as RootState | AreaState;

  const [internalSearchTerm, setInternalSearchTerm] = useState<string>("");
  const [internalSearchStatus, setInternalSearchStatus] =
    useState<SearchStatus>(SearchStatus.SEARCHED);
  const [internalSearchResults, setInternalSearchResults] = useState<
    PointState[]
  >([]);

  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService>();
  const geocoderRef = useRef<google.maps.Geocoder>();

  const fetchSearchResults = useRef(
    debounce(async (searchTerm: string) => {
      setInternalSearchTerm(searchTerm);
      setInternalSearchStatus(SearchStatus.SEARCHING);

      if (!autocompleteServiceRef.current) {
        throw new Error("Did not find autocompleteServiceRef.");
      }

      if (!geocoderRef.current) {
        throw new Error("Did not find geocoderRef.");
      }

      let request: {
        input: string;
        locationRestriction?: google.maps.LatLngBoundsLiteral;
      } = {
        input: searchTerm,
      };

      if (parentLocation.featureType === FeatureType.AREA) {
        request.locationRestriction = parentLocation.searchBounds;
      }

      const response = (
        await autocompleteServiceRef.current.getPlacePredictions(request)
      ).predictions;

      const searchResults = (
        await Promise.all(
          response.map(
            async (autocompletePrediction) =>
              await getPointState(
                parentLocation,
                autocompletePrediction,
                geocoderRef,
              ),
          ),
        )
      ).filter((result): result is PointState => result !== null);

      setInternalSearchResults(searchResults);
      setInternalSearchStatus(SearchStatus.SEARCHED);
    }, 300),
  ).current;

  const setSearchTerm = useCallback(
    (searchTerm: string) => {
      if (searchTerm !== "") {
        fetchSearchResults(searchTerm);
      } else {
        setInternalSearchTerm("");
        setInternalSearchResults([]);
        setInternalSearchStatus(SearchStatus.SEARCHED);
      }
    },
    [fetchSearchResults],
  );

  const reset = useCallback(() => {
    setInternalSearchTerm("");
    setInternalSearchStatus(SearchStatus.SEARCHED);
    setInternalSearchResults([]);
  }, []);

  // TODO: Feel like this should maybe be loaded at the app level
  useEffect(() => {
    const mapsLibrary = window.google.maps;

    if (!mapsLibrary) {
      console.error("Did not find Google Maps library.");
      return;
    }

    if (!autocompleteServiceRef.current) {
      const placesLibrary = mapsLibrary.places;

      if (!placesLibrary) {
        console.error("Did not find Google Places library.");
        return;
      }

      autocompleteServiceRef.current = new placesLibrary.AutocompleteService();
    }

    if (!geocoderRef.current) {
      geocoderRef.current = new mapsLibrary.Geocoder();
    }
  }, []);

  return {
    term: internalSearchTerm,
    status: internalSearchStatus,
    results: internalSearchResults,
    setTerm: setSearchTerm,
    reset,
  };
}

async function getPointState(
  parentLocation: RootState | AreaState,
  autocompletePrediction: google.maps.places.AutocompletePrediction,
  geocoderRef: RefObject<google.maps.Geocoder>,
): Promise<PointState | null> {
  const point = await getPoint(
    parentLocation,
    autocompletePrediction,
    geocoderRef,
  );

  if (!point) {
    return null;
  }

  const displayBounds = getDisplayBounds(point);

  return {
    id: crypto.randomUUID(),
    parentId: parentLocation.id,
    googlePlacesId: autocompletePrediction.place_id,
    longName: autocompletePrediction.description,
    shortName: autocompletePrediction.description,
    userDefinedName: null,
    featureType: FeatureType.POINT as FeatureType.POINT,
    displayBounds,
    point,
    answeredCorrectly: null,
  };
}

async function getPoint(
  parentLocation: RootState | AreaState,
  autocompletePrediction: google.maps.places.AutocompletePrediction,
  geocoderRef: RefObject<google.maps.Geocoder>,
): Promise<Point | null> {
  const geocoderResult = (
    await geocoderRef.current.geocode({
      placeId: autocompletePrediction.place_id,
    })
  ).results[0];

  const lat = geocoderResult.geometry.location.lat();
  const lng = geocoderResult.geometry.location.lng();

  const point: Point = { type: "Point", coordinates: [lng, lat] };

  if (parentLocation.featureType === FeatureType.ROOT) {
    return point;
  }

  const parentPolygons = parentLocation.polygons;

  if (booleanIntersects(point, parentPolygons)) {
    return point;
  }

  return null;
}

function getDisplayBounds(point: Point) {
  return {
    north: point.coordinates[1] + 0.1,
    south: point.coordinates[1] - 0.1,
    east: point.coordinates[0] + 0.1,
    west: point.coordinates[0] - 0.1,
  };
}
