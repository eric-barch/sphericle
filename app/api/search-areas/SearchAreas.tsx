export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const query = requestUrl.searchParams.get("query");
  const url = `http://nominatim.openstreetmap.org/search?q=${query}&polygon_geojson=1&format=json`;
  return await fetch(url);
}
