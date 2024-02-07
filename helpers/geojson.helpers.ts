import { AllGeoJSON } from "@turf/helpers";
import { MultiPolygon, Polygon } from "geojson";

const isPolygon = (geoJson: AllGeoJSON): geoJson is Polygon => {
  return geoJson.type === "Polygon";
};

const isMultiPolygon = (geoJson: AllGeoJSON): geoJson is MultiPolygon => {
  return geoJson.type === "MultiPolygon";
};

const flattenCoordinates = (geojson: AllGeoJSON) => {
  if (isPolygon(geojson)) {
    return geojson.coordinates[0];
  } else if (isMultiPolygon(geojson)) {
    return geojson.coordinates.flat(2);
  }
};

export { isPolygon, isMultiPolygon, flattenCoordinates };
