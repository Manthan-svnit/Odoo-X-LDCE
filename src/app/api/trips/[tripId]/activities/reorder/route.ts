import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { reorderSchema } from "@/lib/validations";
import { apiSuccess, apiUnauthorized, apiError, apiForbidden, apiNotFound } from "@/lib/api";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();

    const { tripId } = await params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.deletedAt) return apiNotFound("Trip");
    if (trip.userId !== session.sub) return apiForbidden();

    const body = await req.json();
    const parsed = reorderSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, "VALIDATION_ERROR");
    }

    const items = parsed.data;

    await prisma.$transaction(
      items.map((item) =>
        prisma.tripActivity.update({
          where: { id: item.id },
          data: { orderIndex: item.orderIndex },
        })
      )
    );

    return apiSuccess({ message: "Activities reordered successfully" });
  } catch (error) {
    console.error("PUT Activities Reorder Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
