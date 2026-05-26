import { getApplicantSession } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { assertRegistrationOpen } from "@/lib/rules";
import { deleteDocumentsFromStorage } from "@/lib/storage";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/registrations/me/documents/[documentId]">,
) {
  try {
    assertRegistrationOpen();

    const session = await getApplicantSession();
    if (!session) {
      return jsonError("Unauthorized", 401);
    }

    const { documentId } = await context.params;
    const document = await prisma.uploadedDocument.findFirst({
      where: {
        id: documentId,
        registrationId: session.registrationId,
      },
      select: { id: true, storagePath: true },
    });

    if (!document) {
      return jsonError("Document not found", 404);
    }

    await deleteDocumentsFromStorage([document.storagePath]);

    await prisma.uploadedDocument.delete({
      where: { id: document.id },
    });

    return Response.json({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
