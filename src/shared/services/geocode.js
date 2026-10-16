// Turns lat/lng into a short place name using the free OpenStreetMap Nominatim API.
// Returns null on any failure so the UI can fall back to showing the coordinates.

export async function getPlaceName(latitude, longitude) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16`;
    const response = await fetch(url, {
      headers: {'User-Agent': 'PlazzaTakeHome/1.0'},
    });
    if (!response.ok) {
      return null;
    }
    const json = await response.json();
    const a = json.address || {};
    const parts = [
      a.neighbourhood || a.suburb || a.road,
      a.city || a.town || a.village || a.county,
    ].filter(Boolean);
    return parts.length ? parts.join(', ') : json.display_name || null;
  } catch (error) {
    return null;
  }
}
