const DEFAULT_BOUNDS = {
  north: 85,
  south: -85,
  west: -180,
  east: 180,
};

const DEFAULT_CENTER = {
  lat: 0,
  lng: 0,
};

const DEFAULT_ZOOM = 0;

const RESTRICTION = {
  latLngBounds: DEFAULT_BOUNDS,
  strictBounds: true,
};

export { DEFAULT_BOUNDS, DEFAULT_CENTER, DEFAULT_ZOOM, RESTRICTION };
