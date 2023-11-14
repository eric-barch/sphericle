import { Coordinate, Polygon } from "@/types";
import React, { useEffect, useMemo, useRef } from "react";

declare global {
  interface Window {
    google: any;
  }
}

interface MapProps {
  mapId: string;
  center: Coordinate;
  zoom: number;
  markers: Coordinate[];
  polygons: Polygon[];
}

export default function Map({
  mapId,
  center: centerProp,
  zoom,
  markers,
  polygons,
}: MapProps) {
  const mapRef = useRef(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<(google.maps.Marker | null)[]>([]);
  const polygonsRef = useRef<(google.maps.Polygon | null)[]>([]);

  const center = useMemo(() => centerProp, [centerProp.lat, centerProp.lng]);

  useEffect(() => {
    if (window.google && mapRef.current && !googleMapRef.current) {
      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        mapId,
        center,
        zoom,
        disableDefaultUI: true,
      });
    }
  }, []);

  useEffect(() => {
    if (googleMapRef.current) {
      googleMapRef.current.panTo(center);
      googleMapRef.current.setZoom(zoom);
    }
  }, [center]);

  useEffect(() => {
    if (googleMapRef.current) {
      googleMapRef.current.panTo(center);
      googleMapRef.current.setZoom(zoom);
    }
  }, [zoom]);

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
      polygonsRef.current.forEach((polygon) => polygon?.setMap(null));
      polygonsRef.current = [];

      polygons.forEach((polygon) => {
        const newPolygon = new window.google.maps.Polygon({
          paths: polygon.coordinates,
          map: googleMapRef.current,
          strokeColor: "#FF0000",
          fillOpacity: 0.0,
        });
        polygonsRef.current.push(newPolygon);
      });
    }
  }, [polygons]);

  return <div className="h-full w-full" ref={mapRef} />;
}
