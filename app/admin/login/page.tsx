import { LoginForm } from "@/components/LoginForms";
import { SportShell } from "@/components/SportShell";

export default function AdminLoginPage() {
  return (
    <SportShell
      eyebrow="Tournament Control"
      title="Admin Login"
      description="ผู้จัดการแข่งขันเข้าสู่ระบบด้วย Username และ Password จาก Environment Variables เพื่อดูรายชื่อนักกีฬาและดาวน์โหลด Player Badge"
    >
      <LoginForm kind="admin" />
    </SportShell>
  );
}
