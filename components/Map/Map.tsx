import { AreaState, PointState } from "@/types";

interface MapProps {
  mapId: string;
  bounds: google.maps.LatLngBoundsLiteral;
  emptyAreas: AreaState[] | AreaState | null;
  filledAreas: AreaState[] | AreaState | null;
  markedPoints: PointState[] | PointState | null;
}

export default function Map() {}
