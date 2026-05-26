import Link from "next/link";
import { LoginForm } from "@/components/LoginForms";
import { SportShell } from "@/components/SportShell";

export default function ApplicantLoginPage() {
  return (
    <SportShell
      title="เข้าสู่ระบบผู้สมัคร"
      description="ใช้ Reference Code และรหัสผ่านที่ตั้งไว้ตอนสมัคร เพื่อดูข้อมูลใบสมัคร แก้ไขข้อมูล และจัดการเอกสารก่อนหมดเขตรับสมัคร"
      actions={
        <Link className="text-sm text-[#b7f53d] underline" href="/apply">
          ยังไม่มี Reference Code สมัครแข่งขัน
        </Link>
      }
    >
      <LoginForm kind="applicant" />
    </SportShell>
  );
}
