import { categoryLabels, skillLevelLabels } from "@/lib/labels";
import { getTournamentName } from "@/lib/rules";
import fontkit from "@pdf-lib/fontkit";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import type { CompetitionCategory, SkillLevel } from "@/lib/generated/prisma/enums";

type BadgeRegistration = {
  referenceCode: string;
  fullName: string;
  clubName: string;
  category: CompetitionCategory;
  skillLevel: SkillLevel;
};

function splitTextByScript(text: string) {
  return text.match(/[\u0E00-\u0E7F]+|[^\u0E00-\u0E7F]+/g) ?? [text];
}

function drawTextWithFonts({
  page,
  text,
  x,
  y,
  size,
  latinFont,
  thaiFont,
  color,
}: {
  page: PDFPage;
  text: string;
  x: number;
  y: number;
  size: number;
  latinFont: PDFFont;
  thaiFont: PDFFont;
  color: ReturnType<typeof rgb>;
}) {
  let currentX = x;

  for (const chunk of splitTextByScript(text)) {
    const font = /[\u0E00-\u0E7F]/.test(chunk) ? thaiFont : latinFont;
    page.drawText(chunk, {
      x: currentX,
      y,
      size,
      font,
      color,
    });
    currentX += font.widthOfTextAtSize(chunk, size);
  }
}

export async function createPlayerBadgePdf(registration: BadgeRegistration) {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const page = pdf.addPage([360, 540]);
  const fontBytes = await readFile(
    path.join(process.cwd(), "public/fonts/NotoSansThai-Regular.ttf"),
  );
  const thaiFont = await pdf.embedFont(fontBytes);
  const latinFont = await pdf.embedFont(StandardFonts.HelveticaBold);

  page.drawRectangle({
    x: 0,
    y: 0,
    width: 360,
    height: 540,
    color: rgb(0.027, 0.067, 0.051),
  });

  page.drawRectangle({
    x: 22,
    y: 22,
    width: 316,
    height: 496,
    borderColor: rgb(0.718, 0.961, 0.239),
    borderWidth: 3,
  });

  drawTextWithFonts({
    page,
    text: getTournamentName(),
    x: 38,
    y: 466,
    size: 15,
    latinFont,
    thaiFont,
    color: rgb(0.718, 0.961, 0.239),
  });

  page.drawText("PLAYER BADGE", {
    x: 38,
    y: 428,
    size: 30,
    font: latinFont,
    color: rgb(1, 1, 1),
  });

  page.drawText(registration.referenceCode, {
    x: 38,
    y: 392,
    size: 18,
    font: latinFont,
    color: rgb(0.718, 0.961, 0.239),
  });

  const rows = [
    ["Name", registration.fullName],
    ["Club", registration.clubName],
    ["Category", categoryLabels[registration.category]],
    ["Level", skillLevelLabels[registration.skillLevel]],
  ];

  let y = 320;
  for (const [label, value] of rows) {
    page.drawText(label.toUpperCase(), {
      x: 42,
      y,
      size: 10,
      font: latinFont,
      color: rgb(0.62, 0.7, 0.66),
    });
    drawTextWithFonts({
      page,
      text: value,
      x: 42,
      y: y - 28,
      size: value.length > 24 ? 17 : 21,
      latinFont,
      thaiFont,
      color: rgb(1, 1, 1),
    });
    y -= 72;
  }

  page.drawRectangle({
    x: 42,
    y: 54,
    width: 276,
    height: 46,
    color: rgb(0.718, 0.961, 0.239),
  });

  page.drawText("CHECK-IN VERIFIED", {
    x: 80,
    y: 69,
    size: 16,
    font: latinFont,
    color: rgb(0.027, 0.067, 0.051),
  });

  return pdf.save();
}
