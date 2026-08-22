import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { apiSuccess, apiUnauthorized, apiError } from "@/lib/api";
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

    const url = await uploadImage(buffer, "globetrotter/uploads");

    if (!url) {
      return apiError("Failed to upload image", "UPLOAD_FAILED", 500);
    }

    return apiSuccess({ url }, 201);
  } catch (error) {
    console.error("Upload Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
