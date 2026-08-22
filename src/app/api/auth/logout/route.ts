import { clearAuthCookie } from "@/lib/auth";
import { apiSuccess } from "@/lib/api";

export async function POST() {
  const cookieProps = clearAuthCookie();
  
  const response = apiSuccess({ message: "Logged out successfully" });
  
  response.cookies.set(cookieProps.name, cookieProps.value, {
    maxAge: cookieProps.maxAge,
    path: cookieProps.path,
  });

  return response;
}
