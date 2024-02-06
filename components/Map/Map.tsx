"use client";

import { useAllFeatures } from "@/components/all-features-provider";
import { useQuizBuilderState } from "@/components/quiz-builder";
import {
  isAreaState,
  isPointState,
  isRootState,
  isSubfeatureState,
} from "@/helpers/type-guards";
import { AreaState, DisplayMode, FeatureState, PointState } from "@/types";
import { RefObject, useEffect, useRef, useState } from "react";

interface MapProps {
  containerRef?: RefObject<HTMLDivElement>;
  padding?: google.maps.Padding;
  onLoad?: () => void;
  mapId: string;
  displayedFeature: FeatureState | null;
  displayMode: DisplayMode;
}

function Map({
  containerRef: propContainerRef,
  padding = { top: 50, right: 50, bottom: 50, left: 50 },
  onLoad,
  mapId,
  displayedFeature,
  displayMode,
}: MapProps) {
  const { allFeatures } = useAllFeatures();
  const { quizBuilderState } = useQuizBuilderState();

  const defaultContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = propContainerRef || defaultContainerRef;
  const mapRef = useRef<google.maps.Map>(null);
  const filledPolygonsRef = useRef<google.maps.Polygon[]>(null);
  const emptyPolygonsRef = useRef<google.maps.Polygon[]>(null);
  const markersRef = useRef<google.maps.Marker[]>(null);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [bounds, setBounds] = useState<google.maps.LatLngBoundsLiteral>(null);
  const [emptyAreas, setEmptyAreas] = useState<AreaState[]>([]);
  const [filledAreas, setFilledAreas] = useState<AreaState[]>([]);
  const [markedPoints, setMarkedPoints] = useState<PointState[]>([]);

  useEffect(() => {
    if (!mapRef.current || !bounds || !isLoaded) {
      return;
    }

    mapRef.current.fitBounds(bounds, padding);
  }, [isLoaded, bounds, padding]);

  useEffect(() => {
    if (!mapRef.current || !isLoaded) {
      return;
    }

    if (emptyPolygonsRef.current) {
      emptyPolygonsRef.current.forEach((polygon) => polygon.setMap(null));
    }

    if (!emptyAreas) {
      emptyPolygonsRef.current = null;
      return;
    }

    const emptyAreaPolygons = emptyAreas.map(
      (areaState: AreaState) => areaState.polygons,
    );

    emptyPolygonsRef.current = emptyAreaPolygons.map((polygon) => {
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
  }, [isLoaded, emptyAreas]);

  useEffect(() => {
    if (!mapRef.current || !isLoaded) {
      return;
    }

    if (filledPolygonsRef.current) {
      filledPolygonsRef.current.forEach((polygon) => polygon.setMap(null));
    }

    if (!filledAreas) {
      filledPolygonsRef.current = null;
      return;
    }

    const filledAreaPolygons = filledAreas.map(
      (areaState: AreaState) => areaState.polygons,
    );

    filledPolygonsRef.current = filledAreaPolygons.map((polygon) => {
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
  }, [isLoaded, filledAreas]);

  useEffect(() => {
    if (!mapRef.current || !isLoaded) {
      return;
    }

    if (markersRef.current) {
      markersRef.current.forEach((marker) => marker.setMap(null));
    }

    if (!markedPoints) {
      markersRef.current = null;
      return;
    }

    const markedPointMarkers = markedPoints.map(
      (pointState: PointState) => pointState.point,
    );

    markersRef.current = markedPointMarkers.map(
      (point) =>
        new google.maps.Marker({
          position: { lng: point.coordinates[0], lat: point.coordinates[1] },
          map: mapRef.current,
        }),
    );
  }, [isLoaded, markedPoints]);

  useEffect(() => {
    if (mapRef.current || !containerRef) {
      return;
    }

    mapRef.current = new google.maps.Map(containerRef.current, {
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
  }, [containerRef, mapId]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const tilesloadedListener = google.maps.event.addListener(
      mapRef.current,
      "tilesloaded",
      () => {
        setIsLoaded(true);
      },
    );

    return () => {
      setIsLoaded(false);
      google.maps.event.removeListener(tilesloadedListener);
    };
  }, [mapRef]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    onLoad();
  }, [isLoaded, onLoad]);

  useEffect(() => {
    if (!displayedFeature || isRootState(displayedFeature)) {
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
            if (
              quizBuilderState.openFeatureIds.has(displayedFeature.featureId)
            ) {
              setEmptyAreas([displayedFeature]);
              setFilledAreas(null);
              setMarkedPoints(null);
            } else {
              setEmptyAreas(null);
              setFilledAreas([displayedFeature]);
              setMarkedPoints(null);
            }
          } else if (isPointState(displayedFeature)) {
            setEmptyAreas(null);
            setFilledAreas(null);
            setMarkedPoints([displayedFeature]);
          }
        } else if (isAreaState(parentFeature)) {
          if (isAreaState(displayedFeature)) {
            if (
              quizBuilderState.openFeatureIds.has(displayedFeature.featureId)
            ) {
              setBounds(displayedFeature.displayBounds);
              setEmptyAreas([displayedFeature]);
              setFilledAreas(null);
              setMarkedPoints(null);
            } else {
              setBounds(parentFeature.displayBounds);
              setEmptyAreas([parentFeature]);
              setFilledAreas([displayedFeature]);
              setMarkedPoints(null);
            }
          } else if (isPointState(displayedFeature)) {
            setBounds(parentFeature.displayBounds);
            setEmptyAreas([parentFeature]);
            setFilledAreas(null);
            setMarkedPoints([displayedFeature]);
          }
        }
        break;
      case DisplayMode.QUIZ_TAKER:
        if (isRootState(parentFeature)) {
          setBounds(displayedFeature.displayBounds);

          if (isAreaState(displayedFeature)) {
            setEmptyAreas(null);
            setFilledAreas([displayedFeature]);
            setMarkedPoints(null);
          } else if (isPointState(displayedFeature)) {
            setEmptyAreas(null);
            setFilledAreas(null);
            setMarkedPoints([displayedFeature]);
          }
        } else if (isAreaState(parentFeature)) {
          setBounds(parentFeature.displayBounds);
          setEmptyAreas([parentFeature]);

          if (isAreaState(displayedFeature)) {
            setFilledAreas([displayedFeature]);
            setMarkedPoints(null);
          } else if (isPointState(displayedFeature)) {
            setFilledAreas(null);
            setMarkedPoints([displayedFeature]);
          }
        }
        break;
    }
  }, [allFeatures, displayedFeature, displayMode, quizBuilderState]);

  return <div className={`h-full w-full`} ref={containerRef} />;
}

export { Map };
