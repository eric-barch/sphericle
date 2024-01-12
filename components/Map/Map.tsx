"use client";

import { useAllFeatures } from "@/components/AllFeaturesProvider";
import {
  AreaState,
  DisplayMode,
  FeatureType,
  PointState,
  RootState,
} from "@/types";
import { RefObject, useCallback, useEffect, useRef } from "react";

interface MapProps {
  containerRef?: RefObject<HTMLDivElement>;
  padding?: google.maps.Padding;
  onLoad?: () => void;
  mapId: string;
  displayedFeature: RootState | AreaState | PointState | null;
  displayMode: DisplayMode;
}

export default function Map({
  containerRef: propContainerRef,
  padding = { top: 50, right: 50, bottom: 50, left: 50 },
  onLoad,
  mapId,
  displayedFeature,
  displayMode,
}: MapProps) {
  const { allFeatures } = useAllFeatures();

  const defaultMapRef = useRef<HTMLDivElement>(null);
  const containerRef = propContainerRef || defaultMapRef;
  const mapRef = useRef<google.maps.Map | null>(null);
  const filledAreasRef = useRef<google.maps.Polygon[] | null>(null);
  const emptyAreasRef = useRef<google.maps.Polygon[] | null>(null);
  const markedPointsRef = useRef<google.maps.Marker[] | null>(null);

  const setBounds = useCallback(
    (bounds: google.maps.LatLngBoundsLiteral) => {
      if (!mapRef?.current || !bounds) {
        return;
      }

      mapRef.current.fitBounds(bounds, padding);
    },
    [padding],
  );

  const setEmptyAreas = useCallback((emptyAreas: AreaState | null) => {
    if (!mapRef?.current) {
      return;
    }

    if (emptyAreasRef.current) {
      emptyAreasRef.current.forEach((polygon) => polygon.setMap(null));
    }

    const emptyAreaPolygons = emptyAreas
      ? (Array.isArray(emptyAreas) ? emptyAreas : [emptyAreas]).map(
          (area) => area.polygons,
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
  }, []);

  const setFilledAreas = useCallback((filledAreas: AreaState | null) => {
    if (!mapRef?.current) {
      return;
    }

    if (filledAreasRef?.current) {
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
  }, []);

  const setMarkedPoints = useCallback((markedPoints: PointState | null) => {
    if (!mapRef?.current) {
      return;
    }

    if (markedPointsRef?.current) {
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
  }, []);

  useEffect(() => {
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
  }, [containerRef, onLoad, mapId]);

  useEffect(() => {
    if (!mapRef) {
      return;
    }

    const tilesloadedListener = google.maps.event.addListener(
      mapRef.current,
      "tilesloaded",
      () => {
        console.log("tilesloaded");
        onLoad();
      },
    );

    return () => {
      google.maps.event.removeListener(tilesloadedListener);
      console.log("Removed tilesloaded listener.");
    };
  }, [mapRef, onLoad]);

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

    const parentLocation = allFeatures.get(displayedFeature.parentFeatureId);

    if (parentLocation.featureType === FeatureType.ROOT) {
      if (displayedFeature.featureType === FeatureType.AREA) {
        setBounds(displayedFeature.displayBounds);

        if (displayedFeature.isOpen) {
          setEmptyAreas(displayedFeature);
          setFilledAreas(null);
          setMarkedPoints(null);
        } else if (!displayedFeature.isOpen) {
          setEmptyAreas(null);
          setFilledAreas(displayedFeature);
          setMarkedPoints(null);
        }
      } else if (displayedFeature.featureType === FeatureType.POINT) {
        setBounds(displayedFeature.displayBounds);
        setEmptyAreas(null);
        setFilledAreas(null);
        setMarkedPoints(displayedFeature);
      }
    } else if (parentLocation.featureType === FeatureType.AREA) {
      if (displayedFeature.featureType === FeatureType.AREA) {
        if (displayedFeature.isOpen) {
          setBounds(displayedFeature.displayBounds);
          setEmptyAreas(displayedFeature);
          setFilledAreas(null);
          setMarkedPoints(null);
        } else if (!displayedFeature.isOpen) {
          setBounds(parentLocation.displayBounds);
          setEmptyAreas(parentLocation);
          setFilledAreas(displayedFeature);
          setMarkedPoints(null);
        }
      } else if (displayedFeature.featureType === FeatureType.POINT) {
        setBounds(parentLocation.displayBounds);
        setEmptyAreas(parentLocation);
        setFilledAreas(null);
        setMarkedPoints(displayedFeature);
      }
    }
  }, [
    allFeatures,
    displayedFeature,
    setBounds,
    setEmptyAreas,
    setFilledAreas,
    setMarkedPoints,
  ]);

  return <div className={`h-full w-full`} ref={containerRef} />;
}
