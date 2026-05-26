"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, Upload } from "lucide-react";
import {
  Field,
  Notice,
  fileClass,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/FormControls";
import { categoryOptions, skillLevelOptions } from "@/lib/labels";

export function ApplicationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [referenceCode, setReferenceCode] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setReferenceCode("");

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "ส่งใบสมัครไม่สำเร็จ");
      }

      setReferenceCode(data.referenceCode);
      formRef.current?.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ส่งใบสมัครไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  if (referenceCode) {
    return (
      <div className="rounded-lg border border-white/15 bg-[#0d1d15]/95 p-5 shadow-2xl shadow-black/30 sm:p-6">
        <div className="space-y-5">
          <Notice tone="success">
            <span className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 shrink-0" size={20} />
              <span>
                สมัครสำเร็จแล้ว Reference Code ของคุณคือ{" "}
                <strong className="text-[#b7f53d]">{referenceCode}</strong>
              </span>
            </span>
          </Notice>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className={primaryButtonClass} href="/registration">
              จัดการใบสมัคร <ArrowRight size={18} />
            </Link>
            <Link className={secondaryButtonClass} href="/login">
              เข้าระบบภายหลัง
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/15 bg-[#0d1d15]/95 p-5 shadow-2xl shadow-black/30 sm:p-6">
      <form ref={formRef} onSubmit={submit} className="grid gap-4">
        {error ? <Notice tone="error">{error}</Notice> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="ชื่อ-นามสกุล">
            <input className={inputClass} name="fullName" required />
          </Field>
          <Field label="เบอร์โทร">
            <input className={inputClass} name="phone" required />
          </Field>
        </div>

        <Field label="อีเมล">
          <input className={inputClass} name="email" type="email" required />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="ประเภทที่ลงแข่งขัน">
            <select className={inputClass} name="category" required>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="ระดับฝีมือ">
            <select className={inputClass} name="skillLevel" required>
              {skillLevelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="สังกัด/ชมรม">
          <input className={inputClass} name="clubName" required />
        </Field>

        <Field label="รหัสผ่าน" hint="ใช้คู่กับ Reference Code เพื่อกลับมาแก้ไขใบสมัคร">
          <input
            className={inputClass}
            minLength={8}
            name="password"
            type="password"
            required
          />
        </Field>

        <Field
          label="เอกสารประกอบ"
          hint="รองรับ JPG, PNG, WebP, PDF สูงสุด 5 ไฟล์ ไฟล์ละไม่เกิน 4MB"
        >
          <input
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className={fileClass}
            multiple
            name="documents"
            type="file"
          />
        </Field>

        <button className={primaryButtonClass} disabled={loading} type="submit">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
          ส่งใบสมัคร
        </button>
      </form>
    </div>
  );
}
