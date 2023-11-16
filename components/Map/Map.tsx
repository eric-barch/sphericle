import {
  AreaState,
  Bounds,
  Coordinate,
  LocationType,
  PointState,
  Polygon,
} from "@/types";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
  }
}

interface MapProps {
  mapId: string;
  displayedLocation: AreaState | PointState | null;
}

export default function Map({ mapId, displayedLocation }: MapProps) {
  const mapRef = useRef(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<(google.maps.Marker | null)[]>([]);
  const parentPolygonsRef = useRef<(google.maps.Polygon | null)[]>([]);
  const childPolygonsRef = useRef<(google.maps.Polygon | null)[]>([]);

  useEffect(() => {
    if (window.google && mapRef.current && !googleMapRef.current) {
      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        mapId,
        center: { lat: 40.69149154234791, lng: -73.98507972271125 },
        zoom: 12,
        disableDefaultUI: true,
      });
    }
  }, []);

  useEffect(() => {
    if (displayedLocation) {
      if (displayedLocation.locationType === LocationType.Area) {
        if (displayedLocation.open) {
          setBounds(displayedLocation.bounds);
          setParentPolygons(displayedLocation.polygons);
          setChildPolygons([]);
        }

        if (!displayedLocation.open) {
          if (displayedLocation.parent.locationType === LocationType.Tree) {
            setBounds(displayedLocation.bounds);
            setParentPolygons([]);
          }

          if (displayedLocation.parent.locationType === LocationType.Area) {
            setBounds(displayedLocation.parent.bounds);
            setParentPolygons(displayedLocation.parent.polygons);
          }

          setChildPolygons(displayedLocation.polygons);
        }

        setMarkers([]);
      }

      if (displayedLocation.locationType === LocationType.Point) {
        if (displayedLocation.parent.locationType === LocationType.Tree) {
          const coordinate = displayedLocation.coordinate;
          const diff = 0.1;

          const north = coordinate.lat + diff;
          const east = coordinate.lng + diff;
          const south = coordinate.lat - diff;
          const west = coordinate.lng - diff;

          setBounds({ north, east, south, west });
          setParentPolygons([]);
        } else {
          setBounds(displayedLocation.parent.bounds);
          setParentPolygons(displayedLocation.parent.polygons);
        }

        setChildPolygons([]);
        setMarkers([displayedLocation.coordinate]);
      }
    } else {
      setMarkers([]);
      setParentPolygons([]);
      setChildPolygons([]);
    }
  }, [displayedLocation]);

  function setBounds(bounds: Bounds) {
    if (googleMapRef.current) {
      googleMapRef.current.fitBounds(bounds);
    }
  }

  function setMarkers(markers: Coordinate[]) {
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
  }

  function setParentPolygons(polygons: Polygon[]) {
    if (googleMapRef.current) {
      parentPolygonsRef.current.forEach((polygon) => polygon?.setMap(null));
      parentPolygonsRef.current = [];

      polygons.forEach((polygon) => {
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
  }

  function setChildPolygons(polygons: Polygon[]) {
    if (googleMapRef.current) {
      childPolygonsRef.current.forEach((polygon) => polygon?.setMap(null));
      childPolygonsRef.current = [];

      polygons.forEach((polygon) => {
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
  }

  return <div className="h-full w-full" ref={mapRef} />;
}
