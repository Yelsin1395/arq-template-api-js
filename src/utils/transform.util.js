export function limaTimestamp() {
  const date = new Date(new Date().getTime() - 5 * 60 * 60 * 1000);
  return date.toISOString().replace('T', ' ').substring(0, 19);
}

export function buildCoordinates(lat, lng) {
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);

  if (isNaN(latNum) || isNaN(lngNum)) return null;

  return [{ lat: latNum, long: lngNum }];
}

export function extractCoordsFromGoogleMapUrl(url) {
  if (!url || typeof url !== 'string') return null;

  // Soporta formatos comunes:
  // maps.google.com/...@lat,lng
  // maps.app.goo.gl/... (URL corta — no contiene coords)
  // maps.google.com/?q=lat,lng
  // maps.google.com/maps?ll=lat,lng
  const patterns = [/@(-?\d+\.\d+),(-?\d+\.\d+)/, /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/, /[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return buildCoordinates(match[1], match[2]);
  }

  return null;
}
