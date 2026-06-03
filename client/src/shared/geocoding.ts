export type GeocodingResult = {
  lat: number;
  lng: number;
};

export async function searchCityCoordinates(
  city: string,
  country?: string
): Promise<GeocodingResult | null> {
  const query = [city, country].filter(Boolean).join(', ');

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&limit=1`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch coordinates');
  }

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  return {
    lat: Number(data[0].lat),
    lng: Number(data[0].lon),
  };
}
