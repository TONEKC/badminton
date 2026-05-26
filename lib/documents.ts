import {
  ALLOWED_DOCUMENT_TYPES,
  MAX_DOCUMENT_SIZE,
  MAX_DOCUMENTS,
} from "@/lib/rules";
import { sanitizeFileName } from "@/lib/api";

export async function parseUploadedFiles(formData: FormData) {
  const files = formData
    .getAll("documents")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (files.length > MAX_DOCUMENTS) {
    throw new Error(`อัปโหลดเอกสารได้สูงสุด ${MAX_DOCUMENTS} ไฟล์`);
  }

  return Promise.all(
    files.map(async (file) => {
      if (file.size > MAX_DOCUMENT_SIZE) {
        throw new Error(`ไฟล์ ${file.name} มีขนาดเกิน 4MB`);
      }

      if (!ALLOWED_DOCUMENT_TYPES.has(file.type)) {
        throw new Error(`ชนิดไฟล์ ${file.name} ไม่รองรับ`);
      }

      const bytes = await file.arrayBuffer();

      return {
        fileName: sanitizeFileName(file.name),
        contentType: file.type,
        size: file.size,
        buffer: Buffer.from(bytes),
      };
    }),
  );
}
