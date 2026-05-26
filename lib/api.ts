import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleRouteError(error: unknown) {
  if (error instanceof ZodError) {
    return jsonError(error.issues[0]?.message || "Invalid request", 422);
  }

  if (error instanceof Error) {
    if (error.message === "Registration deadline has passed") {
      return jsonError("หมดเขตรับสมัครแล้ว ไม่สามารถแก้ไขข้อมูลได้", 403);
    }

    return jsonError(error.message, 400);
  }

  return jsonError("Unexpected server error", 500);
}

export function sanitizeFileName(name: string) {
  return name.replace(/[^\w.\-ก-๙ ]/g, "_").slice(0, 120) || "document";
}
