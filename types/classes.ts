export class Coordinate {
  lat: number;
  lng: number;

  constructor(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng;
  }

  public getGeoJson(): number[] {
    return [this.lng, this.lat];
  }
}

export class Polygon {
  id: string;
  coordinates: Coordinate[];

  constructor(id: string, coordinates: Coordinate[]) {
    this.id = id;
    this.coordinates = coordinates;
  }

  public getGeoJson(): number[][] {
    return this.coordinates.map((coordinate) => coordinate.getGeoJson());
  }
}
