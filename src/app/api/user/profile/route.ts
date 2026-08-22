import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { updateProfileSchema } from "@/lib/validations";
import { apiSuccess, apiUnauthorized, apiError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();

    const user = await prisma.user.findUnique({
      where: { id: session.sub },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        languagePreference: true,
        preferences: true,
        role: true,
        createdAt: true,
      }
    });

    return apiSuccess(user);
  } catch (error) {
    console.error("GET Profile Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, "VALIDATION_ERROR");
    }

    const data = parsed.data;

    const updated = await prisma.user.update({
      where: { id: session.sub },
      data: {
          name: data.name,
          avatarUrl: data.avatarUrl,
          languagePreference: data.languagePreference,
          preferences: data.preferences ? (data.preferences as any) : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        languagePreference: true,
        preferences: true,
        role: true,
      }
    });

    return apiSuccess(updated);
  } catch (error) {
    console.error("PUT Profile Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
