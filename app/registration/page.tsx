import { redirect } from "next/navigation";
import { RegistrationEditor } from "@/components/RegistrationEditor";
import { SportShell } from "@/components/SportShell";
import { getApplicantSession } from "@/lib/auth";
import { categoryLabels, skillLevelLabels } from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import {
  getRegistrationCloseAt,
  getTournamentName,
  isRegistrationOpen,
} from "@/lib/rules";

export const dynamic = "force-dynamic";

export default async function RegistrationPage() {
  const session = await getApplicantSession();
  if (!session) {
    redirect("/login");
  }

  const registration = await prisma.registration.findUnique({
    where: { id: session.registrationId },
    select: {
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
    redirect("/login");
  }

  return (
    <SportShell
      eyebrow={getTournamentName()}
      title="จัดการใบสมัคร"
      description={`${categoryLabels[registration.category]} · ${
        skillLevelLabels[registration.skillLevel]
      } · ${registration.clubName}`}
    >
      <RegistrationEditor
        canEdit={isRegistrationOpen()}
        closeAt={getRegistrationCloseAt().toISOString()}
        registration={{
          ...registration,
          createdAt: registration.createdAt.toISOString(),
          updatedAt: registration.updatedAt.toISOString(),
          documents: registration.documents.map((document) => ({
            ...document,
            createdAt: document.createdAt.toISOString(),
          })),
        }}
      />
    </SportShell>
  );
}
