import { prisma } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/api";

export async function GET() {
  try {
    // Ping DB
    await prisma.$queryRaw`SELECT 1`;
    return apiSuccess({ status: "ok", timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Healthcheck Error:", error);
    return apiError("Database unreachable", "DB_ERROR", 503);
  }
}
