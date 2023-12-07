export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const query = requestUrl.searchParams.get("query");
  const viewbox = requestUrl.searchParams.get("viewbox");
  const bounded = requestUrl.searchParams.get("bounded");

  const url =
    `http://nominatim.openstreetmap.org/search?q=${query}&polygon_geojson=1&format=json&email=ericmb365@gmail.com` +
    (viewbox ? `&viewbox=${viewbox}` : "") +
    (bounded ? `&bounded=${bounded}` : "");

  return await fetch(url);
}
