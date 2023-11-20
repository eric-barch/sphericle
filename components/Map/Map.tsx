import { AreaState, LocationType, PointState } from "@/types";
import { MultiPolygon, Point, Polygon } from "geojson";
import { useEffect, useRef } from "react";

interface MapProps {
  mapId: string;
  displayedLocation: AreaState | PointState | null;
}

export default function Map({ mapId, displayedLocation }: MapProps) {
  const mapRef = useRef(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const parentPolygonRef = useRef<google.maps.Polygon | null>(null);
  const childPolygonRef = useRef<google.maps.Polygon | null>(null);

  useEffect(() => {
    if (google && mapRef.current && !googleMapRef.current) {
      googleMapRef.current = new google.maps.Map(mapRef.current, {
        mapId,
        center: { lat: 40.69149154234791, lng: -73.98507972271125 },
        zoom: 12,
        disableDefaultUI: true,
      });
    }
  }, []);

  function setBounds(bounds: google.maps.LatLngBoundsLiteral) {
    if (!googleMapRef.current) {
      return;
    }

    googleMapRef.current.panToBounds(bounds);
    googleMapRef.current.fitBounds(bounds);
  }

  function setMarker(point: Point | null) {
    if (!googleMapRef.current) {
      return;
    }

    if (point) {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      markerRef.current = new google.maps.Marker({
        position: { lng: point.coordinates[0], lat: point.coordinates[1] },
        map: googleMapRef.current,
      });
    } else if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
  }

  function setParentPolygon(polygon: Polygon | MultiPolygon | null) {
    if (!googleMapRef.current) {
      return;
    }

    if (polygon) {
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

      if (parentPolygonRef.current) {
        parentPolygonRef.current.setMap(null);
      }

      parentPolygonRef.current = new google.maps.Polygon({
        paths,
        map: googleMapRef.current,
        strokeColor: "#d61613",
        strokeWeight: 1.5,
        fillColor: "#d61613",
        fillOpacity: 0.0,
      });
    } else if (parentPolygonRef.current) {
      parentPolygonRef.current.setMap(null);
      parentPolygonRef.current = null;
    }
  }

  function setChildPolygon(polygon: Polygon | MultiPolygon | null) {
    if (!googleMapRef.current) {
      return;
    }

    if (polygon) {
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

      if (childPolygonRef.current) {
        childPolygonRef.current.setMap(null);
      }

      childPolygonRef.current = new google.maps.Polygon({
        paths,
        map: googleMapRef.current,
        strokeColor: "#d61613",
        strokeWeight: 1.5,
        fillColor: "#d61613",
        fillOpacity: 0.2,
      });
    } else if (childPolygonRef.current) {
      childPolygonRef.current.setMap(null);
      childPolygonRef.current = null;
    }
  }

  useEffect(() => {
    if (displayedLocation) {
      if (displayedLocation.locationType === LocationType.Area) {
        if (displayedLocation.open) {
          setBounds(displayedLocation.bounds);
          setParentPolygon(displayedLocation.polygon);
          setChildPolygon(null);
        } else {
          if (displayedLocation.parent.locationType === LocationType.Tree) {
            setBounds(displayedLocation.bounds);
            setParentPolygon(null);
          } else if (
            displayedLocation.parent.locationType === LocationType.Area
          ) {
            setBounds(displayedLocation.parent.bounds);
            setParentPolygon(displayedLocation.parent.polygon);
          }

          setChildPolygon(displayedLocation.polygon);
        }
        setMarker(null);
      } else if (displayedLocation.locationType === LocationType.Point) {
        if (displayedLocation.parent.locationType === LocationType.Tree) {
          const lng = displayedLocation.point.coordinates[0];
          const lat = displayedLocation.point.coordinates[1];
          const diff = 0.1;

          const north = lat + diff;
          const east = lng + diff;
          const south = lat - diff;
          const west = lng - diff;

          setBounds({ north, east, south, west });
          setParentPolygon(null);
        } else {
          setBounds(displayedLocation.parent.bounds);
          setParentPolygon(displayedLocation.parent.polygon);
        }

        setChildPolygon(null);
        setMarker(displayedLocation.point);
      }
    } else {
      setMarker(null);
      setParentPolygon(null);
      setChildPolygon(null);
    }
  }, [displayedLocation]);

  return <div className="h-full w-full" ref={mapRef} />;
}
