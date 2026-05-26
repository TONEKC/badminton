import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, Eye, Users } from "lucide-react";
import { SportShell } from "@/components/SportShell";
import { getAdminSession } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { categoryLabels, skillLevelLabels } from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import { getTournamentName } from "@/lib/rules";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      referenceCode: true,
      fullName: true,
      phone: true,
      email: true,
      category: true,
      skillLevel: true,
      clubName: true,
      createdAt: true,
      _count: {
        select: { documents: true },
      },
    },
  });

  return (
    <SportShell
      eyebrow={getTournamentName()}
      title="Admin Dashboard"
      description="ดูรายชื่อนักกีฬา ข้อมูลใบสมัคร เอกสารประกอบ และดาวน์โหลด Player ID Card/Badge สำหรับเช็กอินวันแข่งขัน"
      actions={
        <div className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-3 text-white/80">
          <Users size={18} className="text-[#b7f53d]" />
          {registrations.length} registrations
        </div>
      }
    >
      <section className="overflow-hidden rounded-lg border border-white/15 bg-[#0d1d15]/95 shadow-2xl shadow-black/30">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-white/8 text-xs uppercase text-white/55">
              <tr>
                <th className="px-4 py-3">นักกีฬา</th>
                <th className="px-4 py-3">ประเภท</th>
                <th className="px-4 py-3">ระดับ</th>
                <th className="px-4 py-3">เอกสาร</th>
                <th className="px-4 py-3">สมัครเมื่อ</th>
                <th className="px-4 py-3">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {registrations.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-white/55" colSpan={6}>
                    ยังไม่มีผู้สมัคร
                  </td>
                </tr>
              ) : (
                registrations.map((registration) => (
                  <tr key={registration.id} className="hover:bg-white/5">
                    <td className="px-4 py-4">
                      <Link
                        className="font-bold text-white hover:text-[#b7f53d]"
                        href={`/admin/registrations/${registration.id}`}
                      >
                        {registration.fullName}
                      </Link>
                      <p className="mt-1 font-mono text-xs text-[#b7f53d]">
                        {registration.referenceCode}
                      </p>
                      <p className="mt-1 text-xs text-white/50">
                        {registration.email} · {registration.phone}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-white/80">
                      {categoryLabels[registration.category]}
                    </td>
                    <td className="px-4 py-4 text-white/80">
                      {skillLevelLabels[registration.skillLevel]}
                    </td>
                    <td className="px-4 py-4 text-white/80">
                      {registration._count.documents} ไฟล์
                    </td>
                    <td className="px-4 py-4 text-white/60">
                      {formatDateTime(registration.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Link
                          className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 px-3 font-semibold text-white hover:border-[#b7f53d] hover:text-[#b7f53d]"
                          href={`/admin/registrations/${registration.id}`}
                        >
                          <Eye size={16} /> ดู
                        </Link>
                        <Link
                          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#b7f53d] px-3 font-black text-[#07110d] hover:bg-[#d5ff68]"
                          href={`/api/admin/registrations/${registration.id}/badge`}
                        >
                          <Download size={16} /> PDF
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </SportShell>
  );
}
