/**Copied from vis.gl example:
 * https://github.com/visgl/react-google-maps/blob/b0fa2b189866369f4323c9cd805c9cf83478c772/examples/geometry/src/components/polygon.tsx#L4*/

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
import {
  MultiPolygon as GeoJsonMultiPolygon,
  Polygon as GeoJsonPolygon,
} from "geojson";
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
  geoJson?: GeoJsonPolygon | GeoJsonMultiPolygon;
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
    geoJson,
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

  /** Instantiate polygon and attach to map. */
  useEffect(() => {
    if (!map) {
      return;
    }

    polygon.setMap(map);

    return () => {
      polygon.setMap(null);
    };
  }, [map, polygon]);

  /** Attach and re-attach event handlers when prop polygon changes. */
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

  /**Set polygon paths when prop polygon changes. */
  useEffect(() => {
    if (!geoJson || !geometryLibrary) {
      return;
    }

    if (isPolygon(geoJson)) {
      const paths = geoJson.coordinates[0].map(
        (position) => new google.maps.LatLng(position[1], position[0]),
      );

      polygon.setPaths(paths);
    }

    if (isMultiPolygon(geoJson)) {
      const paths = geoJson.coordinates.map((polygon) =>
        polygon[0].map(
          (position) => new google.maps.LatLng(position[1], position[0]),
        ),
      );

      polygon.setPaths(paths);
    }
  }, [polygon, geoJson, geometryLibrary]);

  return polygon;
}

export const Polygon = forwardRef((props: PolygonProps, ref: PolygonRef) => {
  const polygon = usePolygon(props);
  useImperativeHandle(ref, () => polygon, [polygon]);
  return null;
});

Polygon.displayName = "Polygon";
