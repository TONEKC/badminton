import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

type UploadInput = {
  registrationId: string;
  fileName: string;
  contentType: string;
  buffer: Buffer;
};

function getSupabaseStorageClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getSupabaseBucketName() {
  return process.env.SUPABASE_BUCKET_NAME || "badminton-bucket";
}

export function createStoragePath(registrationId: string, fileName: string) {
  const extension = fileName.match(/\.[A-Za-z0-9]{1,10}$/)?.[0].toLowerCase() ?? "";

  return `${registrationId}/${Date.now()}-${randomUUID()}${extension}`;
}

export async function uploadDocumentToStorage(input: UploadInput) {
  const storagePath = createStoragePath(input.registrationId, input.fileName);
  const supabase = getSupabaseStorageClient();

  const { error } = await supabase.storage
    .from(getSupabaseBucketName())
    .upload(storagePath, input.buffer, {
      contentType: input.contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return storagePath;
}

export async function downloadDocumentFromStorage(storagePath: string) {
  const supabase = getSupabaseStorageClient();
  const { data, error } = await supabase.storage
    .from(getSupabaseBucketName())
    .download(storagePath);

  if (error || !data) {
    throw new Error(`Download failed: ${error?.message || "file not found"}`);
  }

  return Buffer.from(await data.arrayBuffer());
}

export async function deleteDocumentsFromStorage(paths: string[]) {
  if (paths.length === 0) {
    return;
  }

  const supabase = getSupabaseStorageClient();
  const { error } = await supabase.storage
    .from(getSupabaseBucketName())
    .remove(paths);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}
