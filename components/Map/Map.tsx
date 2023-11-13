import { Coordinate, Polygon } from "@/types";
import React, { useEffect, useRef } from "react";

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

export default function Map({ mapId, center, zoom }: MapProps) {
  const mapRef = useRef(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);

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

  return <div className="h-full w-full" ref={mapRef} />;
}
