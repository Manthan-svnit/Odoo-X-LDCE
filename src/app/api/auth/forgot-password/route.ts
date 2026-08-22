import { NextRequest } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { forgotPasswordSchema } from "@/lib/validations";
import { apiSuccess, apiError } from "@/lib/api";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, "VALIDATION_ERROR");
    }
    
    const { email } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't leak if user exists
      return apiSuccess({ message: "If an account exists, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiresAt: expiresAt,
      },
    });

    await sendPasswordResetEmail(user.email, resetToken);

    return apiSuccess({ message: "If an account exists, a reset link has been sent." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
