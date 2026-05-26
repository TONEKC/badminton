import { getAdminSession, getApplicantSession } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { downloadDocumentFromStorage } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/documents/[documentId]">,
) {
  try {
    const [{ documentId }, adminSession, applicantSession] = await Promise.all([
      context.params,
      getAdminSession(),
      getApplicantSession(),
    ]);

    if (!adminSession && !applicantSession) {
      return jsonError("Unauthorized", 401);
    }

    const document = await prisma.uploadedDocument.findUnique({
      where: { id: documentId },
      select: {
        fileName: true,
        contentType: true,
        storagePath: true,
        registrationId: true,
      },
    });

    if (!document) {
      return jsonError("Document not found", 404);
    }

    if (
      !adminSession &&
      applicantSession?.registrationId !== document.registrationId
    ) {
      return jsonError("Forbidden", 403);
    }

    const file = await downloadDocumentFromStorage(document.storagePath);
    const body = file.buffer.slice(
      file.byteOffset,
      file.byteOffset + file.byteLength,
    ) as ArrayBuffer;

    return new Response(body, {
      headers: {
        "Content-Type": document.contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          document.fileName,
        )}"`,
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
