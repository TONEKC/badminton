CREATE TYPE "CompetitionCategory" AS ENUM (
  'MENS_SINGLE',
  'WOMENS_SINGLE',
  'MENS_DOUBLE',
  'WOMENS_DOUBLE',
  'MIXED_DOUBLE'
);

CREATE TYPE "SkillLevel" AS ENUM ('N', 'S', 'C');

CREATE TABLE "Registration" (
  "id" TEXT NOT NULL,
  "referenceCode" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "category" "CompetitionCategory" NOT NULL,
  "skillLevel" "SkillLevel" NOT NULL,
  "clubName" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UploadedDocument" (
  "id" TEXT NOT NULL,
  "registrationId" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "storagePath" TEXT NOT NULL,
  "contentType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "UploadedDocument_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Registration_referenceCode_key" ON "Registration"("referenceCode");
CREATE UNIQUE INDEX "UploadedDocument_storagePath_key" ON "UploadedDocument"("storagePath");
CREATE INDEX "Registration_createdAt_idx" ON "Registration"("createdAt");
CREATE INDEX "Registration_category_skillLevel_idx" ON "Registration"("category", "skillLevel");
CREATE INDEX "UploadedDocument_registrationId_idx" ON "UploadedDocument"("registrationId");

ALTER TABLE "UploadedDocument"
ADD CONSTRAINT "UploadedDocument_registrationId_fkey"
FOREIGN KEY ("registrationId") REFERENCES "Registration"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
