export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const query = requestUrl.searchParams.get("query");
  const viewbox = requestUrl.searchParams.get("viewbox");
  const bounded = requestUrl.searchParams.get("bounded");

  console.log(`\nquery: ${query}`);
  console.log(`viewbox: ${viewbox}`);
  console.log(`bounded: ${bounded}`);

  const url =
    `http://nominatim.openstreetmap.org/search?q=${query}&polygon_geojson=1&format=json&email=ericmb365@gmail.com` +
    (viewbox ? `&viewbox=${viewbox}` : "") +
    (bounded ? `&bounded=${bounded}` : "");
  console.log(`url: ${url}`);

  return await fetch(url);
}
