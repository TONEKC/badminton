import Link from "next/link";
import { ShieldCheck, Timer, UploadCloud } from "lucide-react";
import { ApplicationForm } from "@/components/ApplicationForm";
import { SportShell } from "@/components/SportShell";
import { formatDateTime } from "@/lib/format";
import { getRegistrationCloseAt, getTournamentName } from "@/lib/rules";

export default function ApplyPage() {
  const closeAt = getRegistrationCloseAt();

  return (
    <SportShell
      eyebrow={getTournamentName()}
      title="สมัครแข่งขันแบดมินตัน"
      description="กรอกใบสมัคร, แนบเอกสารยืนยันตัวตน และรับ Reference Code สำหรับกลับมาแก้ไขข้อมูลก่อนปิดรับสมัคร"
      actions={
        <div className="grid gap-3 text-sm text-white/70">
          <div className="flex items-center gap-2">
            <Timer size={18} className="text-[#b7f53d]" />
            ปิดรับสมัคร {formatDateTime(closeAt)}
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#b7f53d]" />
            รหัสผ่านถูก hash ก่อนจัดเก็บ
          </div>
          <div className="flex items-center gap-2">
            <UploadCloud size={18} className="text-[#b7f53d]" />
            แนบเอกสารได้หลายไฟล์
          </div>
          <Link className="mt-2 text-[#b7f53d] underline" href="/login">
            มี Reference Code แล้ว เข้าระบบผู้สมัคร
          </Link>
        </div>
      }
    >
      <ApplicationForm />
    </SportShell>
  );
}
