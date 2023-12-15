"use client";

import { AreaState, PointState } from "@/types";
import { RefObject, useEffect, useRef, useState } from "react";

interface MapProps {
  mapRef?: RefObject<HTMLDivElement>;
  mapId: string;
  bounds: google.maps.LatLngBoundsLiteral;
  padding?: google.maps.Padding;
  emptyAreas: AreaState[] | AreaState | null;
  filledAreas: AreaState[] | AreaState | null;
  markedPoints: PointState[] | PointState | null;
}

export default function Map({
  mapRef: propMapRef,
  mapId,
  bounds,
  padding = { top: 50, right: 50, bottom: 50, left: 50 },
  emptyAreas,
  filledAreas,
  markedPoints,
}: MapProps) {
  const [tilesLoaded, setTilesLoaded] = useState<boolean>(false);

  const defaultMapRef = useRef<HTMLDivElement>(null);
  const mapRef = propMapRef || defaultMapRef;
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const filledAreasRef = useRef<google.maps.Polygon[] | null>(null);
  const emptyAreasRef = useRef<google.maps.Polygon[] | null>(null);
  const markedPointsRef = useRef<google.maps.Marker[] | null>(null);

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

    google.maps.event.addListenerOnce(
      googleMapRef.current,
      "tilesloaded",
      () => {
        setTilesLoaded(true);
      },
    );
  }, [mapRef, mapId]);

  useEffect(() => {
    if (!googleMapRef?.current || !bounds || !tilesLoaded) {
      return;
    }

    googleMapRef.current.fitBounds(bounds, padding);
  }, [bounds, padding, tilesLoaded]);

  useEffect(() => {
    if (!googleMapRef?.current || !tilesLoaded) {
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
  }, [emptyAreas, tilesLoaded]);

  useEffect(() => {
    if (!googleMapRef?.current || !tilesLoaded) {
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
  }, [filledAreas, tilesLoaded]);

  useEffect(() => {
    if (!googleMapRef?.current || !tilesLoaded) {
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
  }, [markedPoints, tilesLoaded]);

  return <div className="h-full w-full" ref={mapRef} />;
}
