"use client";

import { AreaState, PointState } from "@/types";
import { RefObject, useEffect, useRef } from "react";

interface MapProps {
  mapRef?: RefObject<HTMLDivElement>;
  mapId: string;
  bounds: google.maps.LatLngBoundsLiteral;
  emptyAreas: AreaState[] | AreaState | null;
  filledAreas: AreaState[] | AreaState | null;
  markedPoints: PointState[] | PointState | null;
}

export default function Map({
  mapRef: propMapRef,
  mapId,
  bounds,
  emptyAreas,
  filledAreas,
  markedPoints,
}: MapProps) {
  const defaultMapRef = useRef<HTMLDivElement>(null);

  const mapRef = propMapRef || defaultMapRef;
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const filledAreasRef = useRef<google.maps.Polygon[] | null>(null);
  const emptyAreasRef = useRef<google.maps.Polygon[] | null>(null);
  const markedPointsRef = useRef<google.maps.Marker[] | null>(null);

  useEffect(() => {
    const center = new google.maps.LatLngBounds(bounds).getCenter();

    const allowedBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-85, -180),
      new google.maps.LatLng(85, 180),
    );

    if (googleMapRef?.current || !mapRef?.current) {
      return;
    }

    googleMapRef.current = new google.maps.Map(mapRef.current, {
      mapId,
      center,
      zoom: 12,
      disableDefaultUI: true,
      restriction: {
        latLngBounds: allowedBounds,
        strictBounds: true,
      },
    });
  }, [mapRef, mapId, bounds]);

  useEffect(() => {
    if (!googleMapRef?.current) {
      return;
    }

    googleMapRef.current.panToBounds(bounds);
    googleMapRef.current.fitBounds(bounds);
  }, [bounds]);

  useEffect(() => {
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
  }, [emptyAreas]);

  useEffect(() => {
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
  }, [filledAreas]);

  useEffect(() => {
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
  }, [markedPoints]);

  return <div className="h-full w-full" ref={mapRef} />;
}
