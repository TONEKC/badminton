"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import {
  Field,
  Notice,
  inputClass,
  primaryButtonClass,
} from "@/components/FormControls";

type LoginKind = "applicant" | "admin";

export function LoginForm({ kind }: { kind: LoginKind }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const endpoint =
      kind === "admin" ? "/api/auth/admin" : "/api/auth/applicant";
    const payload =
      kind === "admin"
        ? {
            username: formData.get("username"),
            password: formData.get("password"),
          }
        : {
            referenceCode: formData.get("referenceCode"),
            password: formData.get("password"),
          };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "เข้าสู่ระบบไม่สำเร็จ");
      }

      router.push(kind === "admin" ? "/admin" : "/registration");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-4 rounded-lg border border-white/15 bg-[#0d1d15]/95 p-5 shadow-2xl shadow-black/30 sm:p-6"
    >
      {error ? <Notice tone="error">{error}</Notice> : null}

      {kind === "admin" ? (
        <Field label="Username">
          <input className={inputClass} name="username" required />
        </Field>
      ) : (
        <Field label="Reference Code">
          <input
            className={inputClass}
            name="referenceCode"
            placeholder="BDM-2026-ABC123"
            required
          />
        </Field>
      )}

      <Field label="Password">
        <input className={inputClass} name="password" type="password" required />
      </Field>

      <button className={primaryButtonClass} disabled={loading} type="submit">
        {loading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
        เข้าสู่ระบบ
      </button>
    </form>
  );
}
