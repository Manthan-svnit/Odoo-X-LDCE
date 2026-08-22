import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { searchActivities } from "@/lib/opentripmap";
import { apiSuccess, apiError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "");
    const lon = parseFloat(searchParams.get("lon") || "");

    if (isNaN(lat) || isNaN(lon)) {
       return apiError("Valid 'lat' and 'lon' parameters are required", "MISSING_PARAM");
    }

    // Call external API
    const activities = await searchActivities(lat, lon);

    // Cache results in DB
    const cachedPlaces = await Promise.all(
        activities.map(async (activity) => {
            return prisma.place.upsert({
                where: {
                    externalProvider_externalPlaceId: {
                        externalProvider: activity.externalProvider!,
                        externalPlaceId: activity.externalPlaceId!,
                    }
                },
                update: {
                    name: activity.name,
                    latitude: activity.latitude,
                    longitude: activity.longitude,
                    cachedAt: new Date(),
                },
                create: {
                    type: "ACTIVITY",
                    externalProvider: activity.externalProvider!,
                    externalPlaceId: activity.externalPlaceId!,
                    name: activity.name || "Unknown",
                    latitude: activity.latitude,
                    longitude: activity.longitude,
                }
            });
        })
    );

    return apiSuccess(cachedPlaces);
  } catch (error) {
    console.error("GET Activities Search Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
