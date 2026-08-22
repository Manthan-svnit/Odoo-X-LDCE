import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { apiSuccess, apiUnauthorized, apiError, apiForbidden } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();
    if (session.role !== "ADMIN") return apiForbidden("Admin access required");

    const totalUsers = await prisma.user.count({ where: { deletedAt: null } });
    const totalTrips = await prisma.trip.count({ where: { deletedAt: null } });
    const totalActivities = await prisma.tripActivity.count();
    
    // Group users by creation month for a simple chart
    const usersByMonthRaw = await prisma.$queryRaw`
      SELECT DATE_TRUNC('month', created_at) as month, COUNT(*) as count
      FROM users
      WHERE deleted_at IS NULL
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month ASC
      LIMIT 12
    `;

    return apiSuccess({
      totals: {
        users: totalUsers,
        trips: totalTrips,
        activities: totalActivities,
      },
      chartData: usersByMonthRaw,
    });
  } catch (error) {
    console.error("GET Admin Stats Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
