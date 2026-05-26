"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileDown, Loader2, Save, Trash2, Upload } from "lucide-react";
import {
  Field,
  Notice,
  fileClass,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/FormControls";
import { categoryOptions, skillLevelOptions } from "@/lib/labels";
import { formatDateTime, formatFileSize } from "@/lib/format";
import type { CompetitionCategory, SkillLevel } from "@/lib/generated/prisma/enums";

type RegistrationDocument = {
  id: string;
  fileName: string;
  contentType: string;
  size: number;
  createdAt: string;
};

type RegistrationForEdit = {
  referenceCode: string;
  fullName: string;
  phone: string;
  email: string;
  category: CompetitionCategory;
  skillLevel: SkillLevel;
  clubName: string;
  createdAt: string;
  updatedAt: string;
  documents: RegistrationDocument[];
};

export function RegistrationEditor({
  registration,
  canEdit,
  closeAt,
}: {
  registration: RegistrationForEdit;
  canEdit: boolean;
  closeAt: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      category: formData.get("category"),
      skillLevel: formData.get("skillLevel"),
      clubName: formData.get("clubName"),
    };

    try {
      const response = await fetch("/api/registrations/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "บันทึกข้อมูลไม่สำเร็จ");
      }
      setMessage("บันทึกข้อมูลใบสมัครแล้ว");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "บันทึกข้อมูลไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/registrations/me/documents", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "อัปโหลดเอกสารไม่สำเร็จ");
      }
      setMessage("อัปโหลดเอกสารแล้ว");
      (event.target as HTMLFormElement).reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "อัปโหลดเอกสารไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  }

  async function removeDocument(documentId: string) {
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/registrations/me/documents/${documentId}`,
        { method: "DELETE" },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "ลบเอกสารไม่สำเร็จ");
      }
      setMessage("ลบเอกสารแล้ว");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ลบเอกสารไม่สำเร็จ");
    }
  }

  return (
    <div className="grid gap-5">
      <div className="rounded-lg border border-[#b7f53d]/40 bg-[#b7f53d]/10 p-4">
        <p className="text-xs font-bold uppercase text-[#b7f53d]">
          Reference Code
        </p>
        <p className="mt-1 font-mono text-2xl font-black text-white">
          {registration.referenceCode}
        </p>
      </div>

      {!canEdit ? (
        <Notice tone="error">
          หมดเขตรับสมัครและแก้ไขข้อมูลแล้ว ตั้งแต่ {formatDateTime(closeAt)}
        </Notice>
      ) : (
        <Notice>แก้ไขข้อมูลได้ถึง {formatDateTime(closeAt)}</Notice>
      )}
      {message ? <Notice tone="success">{message}</Notice> : null}
      {error ? <Notice tone="error">{error}</Notice> : null}

      <form
        onSubmit={save}
        className="grid gap-4 rounded-lg border border-white/15 bg-[#0d1d15]/95 p-5 sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="ชื่อ-นามสกุล">
            <input
              className={inputClass}
              defaultValue={registration.fullName}
              disabled={!canEdit}
              name="fullName"
              required
            />
          </Field>
          <Field label="เบอร์โทร">
            <input
              className={inputClass}
              defaultValue={registration.phone}
              disabled={!canEdit}
              name="phone"
              required
            />
          </Field>
        </div>

        <Field label="อีเมล">
          <input
            className={inputClass}
            defaultValue={registration.email}
            disabled={!canEdit}
            name="email"
            type="email"
            required
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="ประเภทที่ลงแข่งขัน">
            <select
              className={inputClass}
              defaultValue={registration.category}
              disabled={!canEdit}
              name="category"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="ระดับฝีมือ">
            <select
              className={inputClass}
              defaultValue={registration.skillLevel}
              disabled={!canEdit}
              name="skillLevel"
            >
              {skillLevelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="สังกัด/ชมรม">
          <input
            className={inputClass}
            defaultValue={registration.clubName}
            disabled={!canEdit}
            name="clubName"
            required
          />
        </Field>

        <button className={primaryButtonClass} disabled={!canEdit || saving} type="submit">
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          บันทึกข้อมูล
        </button>
      </form>

      <section className="rounded-lg border border-white/15 bg-[#0d1d15]/95 p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-white">เอกสารประกอบ</h2>
            <p className="mt-1 text-sm text-white/55">
              เพิ่ม, ลบ หรือเปลี่ยนเอกสารก่อนหมดเขตรับสมัคร
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          {registration.documents.length === 0 ? (
            <Notice>ยังไม่มีเอกสารประกอบ</Notice>
          ) : (
            registration.documents.map((document) => (
              <div
                key={document.id}
                className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-white">{document.fileName}</p>
                  <p className="text-sm text-white/50">
                    {formatFileSize(document.size)} · {formatDateTime(document.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    className={secondaryButtonClass}
                    href={`/api/documents/${document.id}`}
                  >
                    <FileDown size={17} /> ดาวน์โหลด
                  </Link>
                  <button
                    className={secondaryButtonClass}
                    disabled={!canEdit}
                    onClick={() => removeDocument(document.id)}
                    type="button"
                  >
                    <Trash2 size={17} /> ลบ
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={upload} className="mt-5 grid gap-4">
          <Field label="เพิ่มเอกสารใหม่">
            <input
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className={fileClass}
              disabled={!canEdit}
              multiple
              name="documents"
              type="file"
              required
            />
          </Field>
          <button
            className={primaryButtonClass}
            disabled={!canEdit || uploading}
            type="submit"
          >
            {uploading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Upload size={18} />
            )}
            อัปโหลดเอกสาร
          </button>
        </form>
      </section>
    </div>
  );
}
