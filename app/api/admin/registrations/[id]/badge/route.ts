import { getAdminSession } from "@/lib/auth";
import { jsonError, handleRouteError } from "@/lib/api";
import { createPlayerBadgePdf } from "@/lib/pdf";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/admin/registrations/[id]/badge">,
) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return jsonError("Unauthorized", 401);
    }

    const { id } = await context.params;
    const registration = await prisma.registration.findUnique({
      where: { id },
      select: {
        referenceCode: true,
        fullName: true,
        clubName: true,
        category: true,
        skillLevel: true,
      },
    });

    if (!registration) {
      return jsonError("Registration not found", 404);
    }

    const pdf = await createPlayerBadgePdf(registration);
    const body = pdf.buffer.slice(
      pdf.byteOffset,
      pdf.byteOffset + pdf.byteLength,
    ) as ArrayBuffer;

    return new Response(body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${registration.referenceCode}-badge.pdf"`,
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
