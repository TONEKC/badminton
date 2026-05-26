import { setAdminSession } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/api";
import { adminLoginSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = adminLoginSchema.parse(await request.json());
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      return jsonError("Admin credentials are not configured", 500);
    }

    if (payload.username !== username || payload.password !== password) {
      return jsonError("Username หรือรหัสผ่านไม่ถูกต้อง", 401);
    }

    await setAdminSession(username);
    return Response.json({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
