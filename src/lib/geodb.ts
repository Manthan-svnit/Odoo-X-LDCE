import { Place } from "@/types";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

export async function searchCities(query: string, limit = 10): Promise<Partial<Place>[]> {
  if (!RAPIDAPI_KEY) {
    console.warn("GeoDB RapidAPI Key not configured. Returning empty array.");
    return [];
  }

  const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(query)}&limit=${limit}&minPopulation=50000&sort=-population`;
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      throw new Error(`GeoDB API error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.data.map((city: any): Partial<Place> => ({
      type: "city",
      externalProvider: "geodb",
      externalPlaceId: `geodb-${city.id}`,
      name: city.name,
      country: city.country,
      region: city.region,
      latitude: city.latitude,
      longitude: city.longitude,
    }));
  } catch (error) {
    console.error("GeoDB Search Failed:", error);
    return [];
  }
}
