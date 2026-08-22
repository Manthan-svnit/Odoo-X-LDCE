import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, signJWT, setAuthCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";
import { apiSuccess, apiError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Zod Validation
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, "VALIDATION_ERROR");
    }
    
    const { name, email, password, additionalInfo, avatarUrl } = parsed.data;

    // Check duplicate
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return apiError("Email already in use", "EMAIL_EXISTS");
    }

    const passwordHash = await hashPassword(password);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        avatarUrl,
        preferences: additionalInfo ? { additionalInfo } : undefined,
      },
    });

    // Create JWT
    const token = await signJWT({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Set cookie
    const cookieProps = setAuthCookie(token);
    const response = apiSuccess({ user: { id: user.id, email: user.email, name: user.name } }, 201);
    
    response.cookies.set(cookieProps.name, cookieProps.value, {
      httpOnly: cookieProps.httpOnly,
      secure: cookieProps.secure,
      sameSite: cookieProps.sameSite,
      maxAge: cookieProps.maxAge,
      path: cookieProps.path,
    });

    return response;
  } catch (error) {
    console.error("Register Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
