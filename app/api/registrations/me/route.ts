import { getApplicantSession } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { assertRegistrationOpen } from "@/lib/rules";
import { registrationFieldsSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function PUT(request: Request) {
  try {
    assertRegistrationOpen();

    const session = await getApplicantSession();
    if (!session) {
      return jsonError("Unauthorized", 401);
    }

    const payload = registrationFieldsSchema.parse(await request.json());

    const registration = await prisma.registration.update({
      where: { id: session.registrationId },
      data: payload,
      select: {
        referenceCode: true,
        updatedAt: true,
      },
    });

    return Response.json(registration);
  } catch (error) {
    return handleRouteError(error);
  }
}
