import { setApplicantSession } from "@/lib/auth";
import { handleRouteError } from "@/lib/api";
import { parseUploadedFiles } from "@/lib/documents";
import { prisma } from "@/lib/prisma";
import { createUniqueReferenceCode } from "@/lib/reference";
import { assertRegistrationOpen } from "@/lib/rules";
import {
  deleteDocumentsFromStorage,
  uploadDocumentToStorage,
} from "@/lib/storage";
import { createRegistrationSchema } from "@/lib/validators";
import { hash } from "bcryptjs";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    assertRegistrationOpen();

    const formData = await request.formData();
    const payload = createRegistrationSchema.parse({
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      category: formData.get("category"),
      skillLevel: formData.get("skillLevel"),
      clubName: formData.get("clubName"),
      password: formData.get("password"),
    });
    const documents = await parseUploadedFiles(formData);
    const referenceCode = await createUniqueReferenceCode(prisma);
    const passwordHash = await hash(payload.password, 12);

    const registration = await prisma.registration.create({
      data: {
        referenceCode,
        fullName: payload.fullName,
        phone: payload.phone,
        email: payload.email,
        category: payload.category,
        skillLevel: payload.skillLevel,
        clubName: payload.clubName,
        passwordHash,
      },
      select: {
        id: true,
        referenceCode: true,
      },
    });

    const uploadedPaths: string[] = [];
    try {
      const documentRows = [];
      for (const document of documents) {
        const storagePath = await uploadDocumentToStorage({
          registrationId: registration.id,
          fileName: document.fileName,
          contentType: document.contentType,
          buffer: document.buffer,
        });
        uploadedPaths.push(storagePath);
        documentRows.push({
          registrationId: registration.id,
          fileName: document.fileName,
          storagePath,
          contentType: document.contentType,
          size: document.size,
        });
      }

      if (documentRows.length > 0) {
        await prisma.uploadedDocument.createMany({ data: documentRows });
      }
    } catch (uploadError) {
      await deleteDocumentsFromStorage(uploadedPaths).catch(() => undefined);
      await prisma.registration.delete({ where: { id: registration.id } });
      throw uploadError;
    }

    await setApplicantSession(registration.id);

    return Response.json({
      referenceCode: registration.referenceCode,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
