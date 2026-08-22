import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, apiNotFound } from "@/lib/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
) {
  try {
    const { placeId } = await params;

    const place = await prisma.place.findUnique({
      where: { id: placeId },
    });

    if (!place) return apiNotFound("Place");

    return apiSuccess(place);
  } catch (error) {
    console.error("GET Place Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
