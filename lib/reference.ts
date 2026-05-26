import type { PrismaClient } from "@/lib/generated/prisma/client";

export function makeReferenceCode(now = new Date(), random = Math.random()) {
  const year = now.getUTCFullYear();
  const value = Math.floor(random * 36 ** 6)
    .toString(36)
    .toUpperCase()
    .padStart(6, "0");

  return `BDM-${year}-${value}`;
}

export async function createUniqueReferenceCode(
  prisma: PrismaClient,
  attempts = 8,
) {
  for (let index = 0; index < attempts; index += 1) {
    const referenceCode = makeReferenceCode();
    const existing = await prisma.registration.findUnique({
      where: { referenceCode },
      select: { id: true },
    });

    if (!existing) {
      return referenceCode;
    }
  }

  throw new Error("Unable to allocate registration reference code");
}
