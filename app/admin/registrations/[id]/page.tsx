import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Download, FileDown } from "lucide-react";
import { SportShell } from "@/components/SportShell";
import { getAdminSession } from "@/lib/auth";
import { formatDateTime, formatFileSize } from "@/lib/format";
import { categoryLabels, skillLevelLabels } from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import { getTournamentName } from "@/lib/rules";

export const dynamic = "force-dynamic";

export default async function AdminRegistrationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const registration = await prisma.registration.findUnique({
    where: { id },
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
      updatedAt: true,
      documents: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          fileName: true,
          contentType: true,
          size: true,
          createdAt: true,
        },
      },
    },
  });

  if (!registration) {
    notFound();
  }

  const detailRows = [
    ["Reference Code", registration.referenceCode],
    ["ชื่อ-นามสกุล", registration.fullName],
    ["เบอร์โทร", registration.phone],
    ["อีเมล", registration.email],
    ["ประเภท", categoryLabels[registration.category]],
    ["ระดับ", skillLevelLabels[registration.skillLevel]],
    ["สังกัด/ชมรม", registration.clubName],
    ["สมัครเมื่อ", formatDateTime(registration.createdAt)],
    ["อัปเดตล่าสุด", formatDateTime(registration.updatedAt)],
  ];

  return (
    <SportShell
      eyebrow={getTournamentName()}
      title={registration.fullName}
      description={`${registration.referenceCode} · ${
        categoryLabels[registration.category]
      } · ${skillLevelLabels[registration.skillLevel]}`}
      actions={
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/15 px-5 text-sm font-bold text-white hover:border-[#b7f53d] hover:text-[#b7f53d]"
            href="/admin"
          >
            <ArrowLeft size={18} /> กลับ Dashboard
          </Link>
          <Link
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#b7f53d] px-5 text-sm font-black text-[#07110d] hover:bg-[#d5ff68]"
            href={`/api/admin/registrations/${registration.id}/badge`}
          >
            <Download size={18} /> ดาวน์โหลด Badge PDF
          </Link>
        </div>
      }
    >
      <div className="grid gap-5">
        <section className="rounded-lg border border-white/15 bg-[#0d1d15]/95 p-5 shadow-2xl shadow-black/30 sm:p-6">
          <h2 className="text-xl font-black text-white">ข้อมูลใบสมัคร</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            {detailRows.map(([label, value]) => (
              <div key={label} className="border-b border-white/10 pb-3">
                <dt className="text-xs font-bold uppercase text-white/45">
                  {label}
                </dt>
                <dd className="mt-1 text-base font-semibold text-white">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-lg border border-white/15 bg-[#0d1d15]/95 p-5 sm:p-6">
          <h2 className="text-xl font-black text-white">เอกสารประกอบ</h2>
          <div className="mt-4 grid gap-3">
            {registration.documents.length === 0 ? (
              <div className="rounded-lg border border-white/15 bg-white/5 p-4 text-sm text-white/60">
                ยังไม่มีเอกสารประกอบ
              </div>
            ) : (
              registration.documents.map((document) => (
                <div
                  key={document.id}
                  className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">{document.fileName}</p>
                    <p className="text-sm text-white/50">
                      {formatFileSize(document.size)} · {document.contentType} ·{" "}
                      {formatDateTime(document.createdAt)}
                    </p>
                  </div>
                  <Link
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/15 px-3 text-sm font-bold text-white hover:border-[#b7f53d] hover:text-[#b7f53d]"
                    href={`/api/documents/${document.id}`}
                  >
                    <FileDown size={17} /> ดาวน์โหลด
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </SportShell>
  );
}
