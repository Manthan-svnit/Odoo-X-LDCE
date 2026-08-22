import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { searchCities } from "@/lib/geodb";
import { apiSuccess, apiError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
       return apiError("Query parameter 'q' is required", "MISSING_PARAM");
    }

    // Call external API
    const cities = await searchCities(query);

    // Cache results in DB
    const cachedPlaces = await Promise.all(
        cities.map(async (city) => {
            return prisma.place.upsert({
                where: {
                    externalProvider_externalPlaceId: {
                        externalProvider: city.externalProvider!,
                        externalPlaceId: city.externalPlaceId!,
                    }
                },
                update: {
                    name: city.name,
                    country: city.country,
                    latitude: city.latitude,
                    longitude: city.longitude,
                    cachedAt: new Date(),
                },
                create: {
                    type: "CITY",
                    externalProvider: city.externalProvider!,
                    externalPlaceId: city.externalPlaceId!,
                    name: city.name!,
                    country: city.country,
                    latitude: city.latitude,
                    longitude: city.longitude,
                }
            });
        })
    );

    return apiSuccess(cachedPlaces);
  } catch (error) {
    console.error("GET Cities Search Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
