import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, signJWT, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { apiSuccess, apiError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Zod Validation
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, "VALIDATION_ERROR");
    }
    
    const { email, password } = parsed.data;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return apiError("Invalid credentials", "INVALID_CREDENTIALS", 401);
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return apiError("Invalid credentials", "INVALID_CREDENTIALS", 401);
    }

    // Create JWT
    const token = await signJWT({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Set cookie
    const cookieProps = setAuthCookie(token);
    const response = apiSuccess({ user: { id: user.id, email: user.email, name: user.name } });
    
    response.cookies.set(cookieProps.name, cookieProps.value, {
      httpOnly: cookieProps.httpOnly,
      secure: cookieProps.secure,
      sameSite: cookieProps.sameSite,
      maxAge: cookieProps.maxAge,
      path: cookieProps.path,
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
