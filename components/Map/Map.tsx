"use client";

import { useAllFeatures } from "@/components/AllFeaturesProvider";
import { useQuizBuilderState } from "@/components/QuizBuilder";
import {
  isAreaState,
  isPointState,
  isRootState,
  isSubfeatureState,
} from "@/helpers/feature-type-guards";
import {
  AreaState,
  DisplayMode,
  FeatureState,
  FeatureType,
  PointState,
} from "@/types";
import { RefObject, useEffect, useRef, useState } from "react";

interface MapProps {
  mapContainerRef?: RefObject<HTMLDivElement>;
  padding?: google.maps.Padding;
  onLoad?: () => void;
  mapId: string;
  displayedFeature: FeatureState | null;
  displayMode: DisplayMode;
}

export default function Map({
  mapContainerRef: propMapContainerRef,
  padding = { top: 50, right: 50, bottom: 50, left: 50 },
  onLoad,
  mapId,
  displayedFeature,
  displayMode,
}: MapProps) {
  const { allFeatures } = useAllFeatures();
  const { quizBuilderState } = useQuizBuilderState();

  const defaultMapContainerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = propMapContainerRef || defaultMapContainerRef;
  const mapRef = useRef<google.maps.Map>(null);
  const filledAreasRef = useRef<google.maps.Polygon[]>(null);
  const emptyAreasRef = useRef<google.maps.Polygon[]>(null);
  const markedPointsRef = useRef<google.maps.Marker[]>(null);

  const [tilesAreLoaded, setTilesAreLoaded] = useState<boolean>(false);
  const [bounds, setBounds] = useState<google.maps.LatLngBoundsLiteral>(null);
  const [emptyAreas, setEmptyAreas] = useState<AreaState>(null);
  const [filledAreas, setFilledAreas] = useState<AreaState>(null);
  const [markedPoints, setMarkedPoints] = useState<PointState>(null);

  useEffect(() => {
    if (!mapRef.current || !bounds) {
      return;
    }

    if (!bounds) {
      return;
    }

    if (!tilesAreLoaded) {
      return;
    }

    mapRef.current.fitBounds(bounds, padding);
  }, [tilesAreLoaded, bounds, padding]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (!tilesAreLoaded) {
      return;
    }

    if (emptyAreasRef.current) {
      emptyAreasRef.current.forEach((polygon) => polygon.setMap(null));
    }

    const emptyAreaPolygons = emptyAreas
      ? (Array.isArray(emptyAreas) ? emptyAreas : [emptyAreas]).map(
          (area: AreaState) => area.polygons,
        )
      : null;

    if (!emptyAreaPolygons) {
      emptyAreasRef.current = null;
      return;
    }

    emptyAreasRef.current = emptyAreaPolygons.map((polygon) => {
      let paths: google.maps.LatLngLiteral[] | google.maps.LatLngLiteral[][] =
        [];

      if (polygon.type === "MultiPolygon") {
        paths = polygon.coordinates.map((polygon) =>
          polygon[0].map((coordinate) => ({
            lng: Number(coordinate[0]),
            lat: Number(coordinate[1]),
          })),
        );
      } else if (polygon.type === "Polygon") {
        paths = polygon.coordinates[0].map((coordinate) => ({
          lng: Number(coordinate[0]),
          lat: Number(coordinate[1]),
        }));
      }

      return new google.maps.Polygon({
        paths,
        map: mapRef.current,
        strokeColor: "#b91c1c",
        strokeWeight: 2,
        fillColor: "#b91c1c",
        fillOpacity: 0.0,
      });
    });
  }, [tilesAreLoaded, emptyAreas]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (!tilesAreLoaded) {
      return;
    }

    if (filledAreasRef.current) {
      filledAreasRef.current.forEach((polygon) => polygon.setMap(null));
    }

    const filledAreaPolygons = filledAreas
      ? (Array.isArray(filledAreas) ? filledAreas : [filledAreas]).map(
          (area) => area.polygons,
        )
      : null;

    if (!filledAreaPolygons) {
      filledAreasRef.current = null;
      return;
    }

    filledAreasRef.current = filledAreaPolygons.map((polygon) => {
      let paths: google.maps.LatLngLiteral[] | google.maps.LatLngLiteral[][] =
        [];

      if (polygon.type === "MultiPolygon") {
        paths = polygon.coordinates.map((polygon) =>
          polygon[0].map((coordinate) => ({
            lng: Number(coordinate[0]),
            lat: Number(coordinate[1]),
          })),
        );
      } else if (polygon.type === "Polygon") {
        paths = polygon.coordinates[0].map((coordinate) => ({
          lng: Number(coordinate[0]),
          lat: Number(coordinate[1]),
        }));
      }

      return new google.maps.Polygon({
        paths,
        map: mapRef.current,
        strokeColor: "#b91c1c",
        strokeWeight: 1.5,
        fillColor: "#b91c1c",
        fillOpacity: 0.2,
      });
    });
  }, [tilesAreLoaded, filledAreas]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (!tilesAreLoaded) {
      return;
    }

    if (markedPointsRef.current) {
      markedPointsRef.current.forEach((marker) => marker.setMap(null));
    }

    const markedPointMarkers = markedPoints
      ? (Array.isArray(markedPoints) ? markedPoints : [markedPoints]).map(
          (point) => point.point,
        )
      : null;

    if (!markedPointMarkers) {
      markedPointsRef.current = null;
      return;
    }

    markedPointsRef.current = markedPointMarkers.map(
      (point) =>
        new google.maps.Marker({
          position: { lng: point.coordinates[0], lat: point.coordinates[1] },
          map: mapRef.current,
        }),
    );
  }, [tilesAreLoaded, markedPoints]);

  useEffect(() => {
    if (mapRef.current) {
      return;
    }

    if (!mapContainerRef.current) {
      return;
    }

    mapRef.current = new google.maps.Map(mapContainerRef.current, {
      mapId,
      center: { lat: 0, lng: 0 },
      zoom: 2.5,
      disableDefaultUI: true,
      restriction: {
        latLngBounds: {
          east: 180,
          west: -180,
          north: 85,
          south: -85,
        },
        strictBounds: true,
      },
    });
  }, [mapContainerRef, mapId]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const tilesloadedListener = google.maps.event.addListener(
      mapRef.current,
      "tilesloaded",
      () => {
        setTilesAreLoaded(true);
      },
    );

    return () => {
      setTilesAreLoaded(false);
      google.maps.event.removeListener(tilesloadedListener);
    };
  }, [mapRef]);

  useEffect(() => {
    if (!tilesAreLoaded) {
      return;
    }

    onLoad();
  }, [tilesAreLoaded, onLoad]);

  useEffect(() => {
    if (
      !displayedFeature ||
      displayedFeature.featureType === FeatureType.ROOT
    ) {
      setEmptyAreas(null);
      setFilledAreas(null);
      setMarkedPoints(null);
      return;
    }

    if (!isSubfeatureState(displayedFeature)) {
      throw new Error("displayedFeature must be a subfeature.");
    }

    const parentFeature = allFeatures.get(displayedFeature.parentFeatureId);

    switch (displayMode) {
      case DisplayMode.QUIZ_BUILDER:
        if (isRootState(parentFeature)) {
          setBounds(displayedFeature.displayBounds);

          if (isAreaState(displayedFeature)) {
            if (quizBuilderState.openAreas.has(displayedFeature.id)) {
              setEmptyAreas(displayedFeature);
              setFilledAreas(null);
              setMarkedPoints(null);
            } else {
              setEmptyAreas(null);
              setFilledAreas(displayedFeature);
              setMarkedPoints(null);
            }
          } else if (isPointState(displayedFeature)) {
            setEmptyAreas(null);
            setFilledAreas(null);
            setMarkedPoints(displayedFeature);
          }
        } else if (isAreaState(parentFeature)) {
          if (isAreaState(displayedFeature)) {
            if (quizBuilderState.openAreas.has(displayedFeature.id)) {
              setBounds(displayedFeature.displayBounds);
              setEmptyAreas(displayedFeature);
              setFilledAreas(null);
              setMarkedPoints(null);
            } else {
              setBounds(parentFeature.displayBounds);
              setEmptyAreas(parentFeature);
              setFilledAreas(displayedFeature);
              setMarkedPoints(null);
            }
          } else if (isPointState(displayedFeature)) {
            setBounds(parentFeature.displayBounds);
            setEmptyAreas(parentFeature);
            setFilledAreas(null);
            setMarkedPoints(displayedFeature);
          }
        }
        break;
      case DisplayMode.QUIZ_TAKER:
        if (isRootState(parentFeature)) {
          setBounds(displayedFeature.displayBounds);

          if (isAreaState(displayedFeature)) {
            setEmptyAreas(null);
            setFilledAreas(displayedFeature);
            setMarkedPoints(null);
          } else if (isPointState(displayedFeature)) {
            setEmptyAreas(null);
            setFilledAreas(null);
            setMarkedPoints(displayedFeature);
          }
        } else if (isAreaState(parentFeature)) {
          setBounds(parentFeature.displayBounds);
          setEmptyAreas(parentFeature);

          if (isAreaState(displayedFeature)) {
            setFilledAreas(displayedFeature);
            setMarkedPoints(null);
          } else if (isPointState(displayedFeature)) {
            setFilledAreas(null);
            setMarkedPoints(displayedFeature);
          }
        }
        break;
    }
  }, [allFeatures, displayedFeature, displayMode, quizBuilderState]);

  return <div className={`h-full w-full`} ref={mapContainerRef} />;
}
