import { AreaState, LocationType, PointState } from "@/types";
import { MultiPolygon, Point, Polygon } from "geojson";
import { RefObject, useEffect, useRef } from "react";

interface MapProps {
  mapRef?: RefObject<HTMLDivElement>;
  mapId: string;
  displayedLocation: AreaState | PointState | null;
}

export default function Map({ mapRef, mapId, displayedLocation }: MapProps) {
  const ref = mapRef || useRef(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const filledAreasRef = useRef<google.maps.Polygon[] | null>(null);
  const emptyAreasRef = useRef<google.maps.Polygon[] | null>(null);
  const markersRef = useRef<google.maps.Marker[] | null>(null);

  useEffect(() => {
    const allowedBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-85, -180),
      new google.maps.LatLng(85, 180),
    );

    if (google && ref.current && !googleMapRef.current) {
      googleMapRef.current = new google.maps.Map(ref.current, {
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

  function setBounds(bounds: google.maps.LatLngBoundsLiteral) {
    googleMapRef.current.panToBounds(bounds);
    googleMapRef.current.fitBounds(bounds);
  }

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
    if (displayedLocation) {
      if (displayedLocation.locationType === LocationType.Area) {
        if (displayedLocation.isOpen) {
          setEmptyPolygons([displayedLocation.polygon]);
          setFilledPolygons(null);
          setBounds(displayedLocation.displayBounds);
        } else {
          if (
            displayedLocation.parentLocation.locationType === LocationType.Quiz
          ) {
            setEmptyPolygons(null);
            setBounds(displayedLocation.displayBounds);
          } else if (
            displayedLocation.parentLocation.locationType === LocationType.Area
          ) {
            setEmptyPolygons([displayedLocation.parentLocation.polygon]);
            setBounds(displayedLocation.parentLocation.displayBounds);
          }

          setFilledPolygons([displayedLocation.polygon]);
        }
        setMarkers(null);
      } else if (displayedLocation.locationType === LocationType.Point) {
        if (
          displayedLocation.parentLocation.locationType === LocationType.Quiz
        ) {
          const lng = displayedLocation.point.coordinates[0];
          const lat = displayedLocation.point.coordinates[1];
          const diff = 0.1;

          const north = lat + diff;
          const east = lng + diff;
          const south = lat - diff;
          const west = lng - diff;

          setEmptyPolygons(null);
          setBounds({ north, east, south, west });
        } else {
          setEmptyPolygons([displayedLocation.parentLocation.polygon]);
          setBounds(displayedLocation.parentLocation.displayBounds);
        }

        setFilledPolygons(null);
        setMarkers([displayedLocation.point]);
      }
    } else {
      setEmptyPolygons(null);
      setFilledPolygons(null);
      setMarkers(null);
    }
  }, [displayedLocation]);

  return <div className="h-full w-full" ref={ref} />;
}
