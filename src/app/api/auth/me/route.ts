import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiUnauthorized, apiError } from "@/lib/api";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return apiUnauthorized();
    }

    const user = await prisma.user.findUnique({
      where: { id: session.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        languagePreference: true,
        preferences: true,
      },
    });

    if (!user) {
      return apiUnauthorized("User not found");
    }

    return apiSuccess(user);
  } catch (error) {
    console.error("Get Me Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
