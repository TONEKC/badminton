import { getApplicantSession } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/api";
import { parseUploadedFiles } from "@/lib/documents";
import { prisma } from "@/lib/prisma";
import { assertRegistrationOpen, MAX_DOCUMENTS } from "@/lib/rules";
import { uploadDocumentToStorage } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    assertRegistrationOpen();

    const session = await getApplicantSession();
    if (!session) {
      return jsonError("Unauthorized", 401);
    }

    const formData = await request.formData();
    const documents = await parseUploadedFiles(formData);
    if (documents.length === 0) {
      return jsonError("กรุณาเลือกไฟล์เอกสาร", 422);
    }

    const currentCount = await prisma.uploadedDocument.count({
      where: { registrationId: session.registrationId },
    });

    if (currentCount + documents.length > MAX_DOCUMENTS) {
      return jsonError(`เอกสารรวมต้องไม่เกิน ${MAX_DOCUMENTS} ไฟล์`, 422);
    }

    const documentRows = [];
    for (const document of documents) {
      const storagePath = await uploadDocumentToStorage({
        registrationId: session.registrationId,
        fileName: document.fileName,
        contentType: document.contentType,
        buffer: document.buffer,
      });
      documentRows.push({
        registrationId: session.registrationId,
        fileName: document.fileName,
        storagePath,
        contentType: document.contentType,
        size: document.size,
      });
    }

    await prisma.uploadedDocument.createMany({ data: documentRows });

    return Response.json({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
