import { AreaState, PointState } from "@/types";
import { MultiPolygon, Point, Polygon } from "geojson";
import { useEffect, useRef } from "react";

interface MapProps {
  mapId: string;
  bounds: google.maps.LatLngBoundsLiteral;
  filledAreas: AreaState[] | null;
  emptyAreas: AreaState[] | null;
  markers: PointState[] | null;
}

export default function Map({
  mapId,
  bounds,
  emptyAreas,
  filledAreas,
  markers,
}: MapProps) {
  const mapRef = useRef(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const filledAreasRef = useRef<google.maps.Polygon[] | null>(null);
  const emptyAreasRef = useRef<google.maps.Polygon[] | null>(null);
  const markersRef = useRef<google.maps.Marker[] | null>(null);

  useEffect(() => {
    const allowedBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-85, -180),
      new google.maps.LatLng(85, 180),
    );

    if (google && mapRef.current && !googleMapRef.current) {
      googleMapRef.current = new google.maps.Map(mapRef.current, {
        mapId,
        center: { lat: 40.69149154234791, lng: -73.98507972271125 },
        zoom: 12,
        disableDefaultUI: true,
        restriction: {
          latLngBounds: allowedBounds,
          strictBounds: true,
        },
      });
    }
  }, []);

  function setFilledPolygons(polygons: (Polygon | MultiPolygon)[] | null) {
    if (!googleMapRef.current) {
      return;
    }

    if (filledAreasRef.current) {
      filledAreasRef.current.forEach((polygon) => {
        polygon.setMap(null);
      });
    }

    if (polygons) {
      filledAreasRef.current = polygons.map((polygon) => {
        let paths: google.maps.LatLngLiteral[] | google.maps.LatLngLiteral[][];

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
          strokeColor: "#d61613",
          strokeWeight: 1.5,
          fillColor: "#d61613",
          fillOpacity: 0.2,
        });
      });
    } else {
      filledAreasRef.current = null;
    }
  }

  function setEmptyPolygons(polygons: (Polygon | MultiPolygon)[] | null) {
    if (!googleMapRef.current) {
      return;
    }

    if (emptyAreasRef.current) {
      emptyAreasRef.current.forEach((polygon) => {
        polygon.setMap(null);
      });
    }

    if (polygons) {
      emptyAreasRef.current = polygons.map((polygon) => {
        let paths: google.maps.LatLngLiteral[] | google.maps.LatLngLiteral[][];

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
          strokeColor: "#d61613",
          strokeWeight: 1.5,
          fillColor: "#d61613",
          fillOpacity: 0.0,
        });
      });
    } else {
      emptyAreasRef.current = null;
    }
  }

  function setMarkers(points: Point[] | null) {
    if (!googleMapRef.current) {
      return;
    }

    if (markersRef.current) {
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
    }

    if (points) {
      markersRef.current = points.map(
        (point) =>
          new google.maps.Marker({
            position: { lng: point.coordinates[0], lat: point.coordinates[1] },
            map: googleMapRef.current,
          }),
      );
    } else {
      markersRef.current = null;
    }
  }

  useEffect(() => {
    if (bounds) {
      googleMapRef.current.panToBounds(bounds);
      googleMapRef.current.fitBounds(bounds);
    }
  }, [bounds]);

  useEffect(() => {
    if (filledAreas) {
      setFilledPolygons(
        filledAreas.flatMap((filledArea) => filledArea.polygon),
      );
    } else {
      setFilledPolygons(null);
    }
  }, [filledAreas]);

  useEffect(() => {
    if (emptyAreas) {
      setEmptyPolygons(emptyAreas.flatMap((emptyArea) => emptyArea.polygon));
    } else {
      setEmptyPolygons(null);
    }
  }, [emptyAreas]);

  useEffect(() => {
    if (markers) {
      setMarkers(markers.map((marker) => marker.point));
    } else {
      setMarkers(null);
    }
  }, [markers]);

  return <div className="h-full w-full" ref={mapRef} />;
}
