import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { resetPasswordSchema } from "@/lib/validations";
import { apiSuccess, apiError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, "VALIDATION_ERROR");
    }
    
    const { token, password } = parsed.data;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiresAt: {
          gt: new Date(), // must not be expired
        },
      },
    });

    if (!user) {
      return apiError("Invalid or expired reset token", "INVALID_TOKEN", 400);
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    return apiSuccess({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
