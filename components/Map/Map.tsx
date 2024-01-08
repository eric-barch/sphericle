"use client";

import { useAllFeatures } from "@/components/AllFeaturesProvider";
import {
  AreaState,
  DisplayMode,
  FeatureType,
  PointState,
  RootState,
} from "@/types";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";

interface MapProps {
  mapRef?: RefObject<HTMLDivElement>;
  padding?: google.maps.Padding;
  mapId: string;
  displayedFeature: RootState | AreaState | PointState | null;
  displayMode: DisplayMode;
}

export default function Map({
  mapRef: propMapRef,
  padding = { top: 50, right: 50, bottom: 50, left: 50 },
  mapId,
  displayedFeature: displayedLocation,
  displayMode,
}: MapProps) {
  const allFeatures = useAllFeatures();

  const defaultMapRef = useRef<HTMLDivElement>(null);
  const mapRef = propMapRef || defaultMapRef;
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const filledAreasRef = useRef<google.maps.Polygon[] | null>(null);
  const emptyAreasRef = useRef<google.maps.Polygon[] | null>(null);
  const markedPointsRef = useRef<google.maps.Marker[] | null>(null);

  const setBounds = useCallback(
    (bounds: google.maps.LatLngBoundsLiteral) => {
      if (!googleMapRef?.current || !bounds) {
        return;
      }

      googleMapRef.current.fitBounds(bounds, padding);
    },
    [padding],
  );

  const setEmptyAreas = useCallback((emptyAreas: AreaState | null) => {
    if (!googleMapRef?.current) {
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
        map: googleMapRef.current,
        strokeColor: "#b91c1c",
        strokeWeight: 2,
        fillColor: "#b91c1c",
        fillOpacity: 0.0,
      });
    });
  }, []);

  const setFilledAreas = useCallback((filledAreas: AreaState | null) => {
    if (!googleMapRef?.current) {
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
        map: googleMapRef.current,
        strokeColor: "#b91c1c",
        strokeWeight: 1.5,
        fillColor: "#b91c1c",
        fillOpacity: 0.2,
      });
    });
  }, []);

  const setMarkedPoints = useCallback((markedPoints: PointState | null) => {
    if (!googleMapRef?.current) {
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
          map: googleMapRef.current,
        }),
    );
  }, []);

  useEffect(() => {
    if (googleMapRef?.current || !mapRef?.current) {
      return;
    }

    /** TODO: this drives me crazy, but initializing map with zoom < 2.5 causes issues on first
     *  setBounds. */
    googleMapRef.current = new google.maps.Map(mapRef.current, {
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
  }, [mapRef, mapId]);

  useEffect(() => {
    if (
      !displayedLocation ||
      displayedLocation.featureType === FeatureType.ROOT
    ) {
      setEmptyAreas(null);
      setFilledAreas(null);
      setMarkedPoints(null);
      return;
    }

    const parentLocation = allFeatures.features[displayedLocation.parentId];

    if (parentLocation.featureType === FeatureType.ROOT) {
      if (displayedLocation.featureType === FeatureType.AREA) {
        setBounds(displayedLocation.displayBounds);

        if (displayedLocation.isOpen) {
          setEmptyAreas(displayedLocation);
          setFilledAreas(null);
          setMarkedPoints(null);
        } else if (!displayedLocation.isOpen) {
          setEmptyAreas(null);
          setFilledAreas(displayedLocation);
          setMarkedPoints(null);
        }
      } else if (displayedLocation.featureType === FeatureType.POINT) {
        setBounds(displayedLocation.displayBounds);
        setEmptyAreas(null);
        setFilledAreas(null);
        setMarkedPoints(displayedLocation);
      }
    } else if (parentLocation.featureType === FeatureType.AREA) {
      if (displayedLocation.featureType === FeatureType.AREA) {
        if (displayedLocation.isOpen) {
          setBounds(displayedLocation.displayBounds);
          setEmptyAreas(displayedLocation);
          setFilledAreas(null);
          setMarkedPoints(null);
        } else if (!displayedLocation.isOpen) {
          setBounds(parentLocation.displayBounds);
          setEmptyAreas(parentLocation);
          setFilledAreas(displayedLocation);
          setMarkedPoints(null);
        }
      } else if (displayedLocation.featureType === FeatureType.POINT) {
        setBounds(parentLocation.displayBounds);
        setEmptyAreas(parentLocation);
        setFilledAreas(null);
        setMarkedPoints(displayedLocation);
      }
    }
  }, [
    allFeatures,
    displayedLocation,
    setBounds,
    setEmptyAreas,
    setFilledAreas,
    setMarkedPoints,
  ]);

  return <div className="h-full w-full" ref={mapRef} />;
}
