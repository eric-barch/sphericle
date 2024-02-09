import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import { GoogleMapsContext, useMapsLibrary } from "@vis.gl/react-google-maps";

import type { Ref } from "react";
import { MultiPolygon, Polygon as GeoJsonPolygon } from "geojson";
import { isMultiPolygon, isPolygon } from "@/helpers";

type PolygonEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onDrag?: (e: google.maps.MapMouseEvent) => void;
  onDragStart?: (e: google.maps.MapMouseEvent) => void;
  onDragEnd?: (e: google.maps.MapMouseEvent) => void;
  onMouseOver?: (e: google.maps.MapMouseEvent) => void;
  onMouseOut?: (e: google.maps.MapMouseEvent) => void;
};

type PolygonCustomProps = {
  polygon?: GeoJsonPolygon | MultiPolygon;
};

export type PolygonProps = google.maps.PolygonOptions &
  PolygonEventProps &
  PolygonCustomProps;

export type PolygonRef = Ref<google.maps.Polygon | null>;

function usePolygon(props: PolygonProps) {
  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    polygon: geoJsonPolygon,
    ...polygonOptions
  } = props;
  /**Avoid triggering the below useEffect when callbacks change if the user
   * didn't memoize them. */
  const callbacks = useRef<Record<string, (e: unknown) => void>>({});

  Object.assign(callbacks.current, {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
  });

  const geometryLibrary = useMapsLibrary("geometry");

  const polygon = useRef(new google.maps.Polygon()).current;

  useMemo(() => {
    polygon.setOptions(polygonOptions);
  }, [polygon, polygonOptions]);

  const map = useContext(GoogleMapsContext)?.map;

  useMemo(() => {
    if (!geoJsonPolygon || !geometryLibrary) {
      return;
    }

    if (isPolygon(geoJsonPolygon)) {
      const paths = geoJsonPolygon.coordinates[0].map(
        (position) => new google.maps.LatLng(position[1], position[0]),
      );

      polygon.setPaths(paths);
    }

    if (isMultiPolygon(geoJsonPolygon)) {
      const paths = geoJsonPolygon.coordinates.map((polygon) =>
        polygon[0].map(
          (position) => new google.maps.LatLng(position[1], position[0]),
        ),
      );

      polygon.setPaths(paths);
    }
  }, [polygon, geoJsonPolygon, geometryLibrary]);

  /** Instantiate polygon and attach to map. */
  useEffect(() => {
    if (!map) {
      if (map === undefined)
        console.error("<Polygon> has to be inside a Map component.");

      return;
    }

    polygon.setMap(map);

    return () => {
      polygon.setMap(null);
    };
  }, [map, polygon]);

  /** Attach and re-attach event handlers when properties change. */
  useEffect(() => {
    if (!polygon) {
      return;
    }

    /** Add event listeners. */
    const gme = google.maps.event;
    [
      ["click", "onClick"],
      ["drag", "onDrag"],
      ["dragstart", "onDragStart"],
      ["dragend", "onDragEnd"],
      ["mouseover", "onMouseOver"],
      ["mouseout", "onMouseOut"],
    ].forEach(([eventName, eventCallback]) => {
      gme.addListener(polygon, eventName, (e: google.maps.MapMouseEvent) => {
        const callback = callbacks.current[eventCallback];
        if (callback) callback(e);
      });
    });

    return () => {
      gme.clearInstanceListeners(polygon);
    };
  }, [polygon]);

  return polygon;
}

export const Polygon = forwardRef((props: PolygonProps, ref: PolygonRef) => {
  const polygon = usePolygon(props);

  useImperativeHandle(ref, () => polygon, [polygon]);

  return null;
});

Polygon.displayName = "Polygon";
