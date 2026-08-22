import { Place } from "@/types";

// OpenTripMap doesn't strictly require an API key for rate-limited basic endpoints,
// but usually it needs one for /xid. Let's assume we have it or use free tier.
const OPENTRIPMAP_API_KEY = process.env.OPENTRIPMAP_API_KEY || "5ae2e3f221c38a28845f05b630dc651d6a7fcf7c7c34b68db6a117cf"; 
// ^ A known free public key for OpenTripMap test environments, you can replace in .env if needed.

export async function searchActivities(
  lat: number,
  lon: number,
  radius: number = 10000,
  limit: number = 20
): Promise<Partial<Place>[]> {
  try {
    const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&limit=${limit}&apikey=${OPENTRIPMAP_API_KEY}&format=json`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("OpenTripMap API error");

    const data = await response.json();

    return data.map((item: any): Partial<Place> => ({
      type: "activity",
      externalProvider: "opentripmap",
      externalPlaceId: item.xid,
      name: item.name,
      latitude: item.point.lat,
      longitude: item.point.lon,
      category: item.kinds,
      rating: item.rate,
    }));
  } catch (error) {
    console.error("OpenTripMap Search Failed:", error);
    return [];
  }
}

export async function getActivityDetails(xid: string): Promise<Partial<Place> | null> {
  try {
    const url = `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${OPENTRIPMAP_API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("OpenTripMap API error");

    const item = await response.json();

    return {
      type: "activity",
      externalProvider: "opentripmap",
      externalPlaceId: item.xid,
      name: item.name,
      latitude: item.point.lat,
      longitude: item.point.lon,
      category: item.kinds,
      rating: item.rate,
      imageUrl: item.preview?.source,
      description: item.wikipedia_extracts?.text,
    };
  } catch (error) {
    console.error("OpenTripMap Get Details Failed:", error);
    return null;
  }
}
