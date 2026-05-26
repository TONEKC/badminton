import { setApplicantSession } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { applicantLoginSchema } from "@/lib/validators";
import { compare } from "bcryptjs";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = applicantLoginSchema.parse(await request.json());
    const registration = await prisma.registration.findUnique({
      where: {
        referenceCode: payload.referenceCode.toUpperCase(),
      },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!registration) {
      return jsonError("Reference code หรือรหัสผ่านไม่ถูกต้อง", 401);
    }

    const valid = await compare(payload.password, registration.passwordHash);
    if (!valid) {
      return jsonError("Reference code หรือรหัสผ่านไม่ถูกต้อง", 401);
    }

    await setApplicantSession(registration.id);
    return Response.json({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
