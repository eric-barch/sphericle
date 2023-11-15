import { Bounds, Coordinate, Polygon } from "@/types";
import React, { useEffect, useMemo, useRef } from "react";

declare global {
  interface Window {
    google: any;
  }
}

interface MapProps {
  mapId: string;
  bounds: Bounds;
  markers: Coordinate[];
  parentPolygons: Polygon[];
  childPolygons: Polygon[];
}

export default function Map({
  mapId,
  bounds,
  markers,
  parentPolygons,
  childPolygons,
}: MapProps) {
  const mapRef = useRef(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<(google.maps.Marker | null)[]>([]);
  const parentPolygonsRef = useRef<(google.maps.Polygon | null)[]>([]);
  const childPolygonsRef = useRef<(google.maps.Polygon | null)[]>([]);

  useEffect(() => {
    if (window.google && mapRef.current && !googleMapRef.current) {
      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        mapId,
        disableDefaultUI: true,
      });
    }
  }, []);

  useEffect(() => {
    if (googleMapRef.current) {
      googleMapRef.current.fitBounds(bounds);
    }
  }, [bounds]);

  useEffect(() => {
    if (googleMapRef.current) {
      markersRef.current.forEach((marker) => marker?.setMap(null));
      markersRef.current = [];

      markers.forEach((marker) => {
        const newMarker = new window.google.maps.Marker({
          position: marker,
          map: googleMapRef.current,
        });
        markersRef.current.push(newMarker);
      });
    }
  }, [markers]);

  useEffect(() => {
    if (googleMapRef.current) {
      parentPolygonsRef.current.forEach((polygon) => polygon?.setMap(null));
      parentPolygonsRef.current = [];

      parentPolygons.forEach((polygon) => {
        const newPolygon = new window.google.maps.Polygon({
          paths: polygon.coordinates,
          map: googleMapRef.current,
          strokeColor: "#d61613",
          strokeWeight: 1.5,
          fillColor: "#d61613",
          fillOpacity: 0.0,
        });
        parentPolygonsRef.current.push(newPolygon);
      });
    }
  }, [parentPolygons]);

  useEffect(() => {
    if (googleMapRef.current) {
      childPolygonsRef.current.forEach((polygon) => polygon?.setMap(null));
      childPolygonsRef.current = [];

      childPolygons.forEach((polygon) => {
        const newPolygon = new window.google.maps.Polygon({
          paths: polygon.coordinates,
          map: googleMapRef.current,
          strokeColor: "#d61613",
          strokeWeight: 1.5,
          fillColor: "#d61613",
          fillOpacity: 0.2,
        });
        childPolygonsRef.current.push(newPolygon);
      });
    }
  }, [childPolygons]);

  return <div className="h-full w-full" ref={mapRef} />;
}
