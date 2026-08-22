import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { apiSuccess, apiUnauthorized, apiError, apiForbidden } from "@/lib/api";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return apiError("No file uploaded", "MISSING_FILE", 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const url = await uploadImage(buffer, "globetrotter/avatars");

    if (!url) {
      return apiError("Failed to upload image", "UPLOAD_FAILED", 500);
    }

    const updated = await prisma.user.update({
        where: { id: session.sub },
        data: { avatarUrl: url },
        select: { id: true, avatarUrl: true },
    });

    return apiSuccess({ url: updated.avatarUrl }, 201);
  } catch (error) {
    console.error("Avatar Upload Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
