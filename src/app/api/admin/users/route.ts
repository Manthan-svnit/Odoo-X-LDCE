import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { apiSuccess, apiUnauthorized, apiError, apiForbidden } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();
    if (session.role !== "ADMIN") return apiForbidden("Admin access required");

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        deletedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess(users);
  } catch (error) {
    console.error("GET Admin Users Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();
    if (session.role !== "ADMIN") return apiForbidden("Admin access required");

    const body = await req.json();
    const { userId, role, action } = body;

    if (!userId) return apiError("userId is required", "MISSING_PARAM");

    if (action === "DISABLE") {
        await prisma.user.update({
            where: { id: userId },
            data: { deletedAt: new Date() },
        });
    } else if (action === "ENABLE") {
        await prisma.user.update({
            where: { id: userId },
            data: { deletedAt: null },
        });
    } else if (role) {
        if (role !== "ADMIN" && role !== "USER") {
             return apiError("Invalid role", "VALIDATION_ERROR");
        }
        await prisma.user.update({
            where: { id: userId },
            data: { role },
        });
    }

    return apiSuccess({ message: "User updated" });
  } catch (error) {
    console.error("PUT Admin Users Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
