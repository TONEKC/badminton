import { describe, expect, it } from "vitest";
import { createPlayerBadgePdf } from "../lib/pdf";

describe("player badge pdf", () => {
  it("creates a downloadable PDF for a registered player", async () => {
    const pdf = await createPlayerBadgePdf({
      referenceCode: "BDM-2026-ABC123",
      fullName: "Somchai Rakbadminton",
      clubName: "CM Sport Club",
      category: "MENS_SINGLE",
      skillLevel: "N",
    });

    expect(Buffer.from(pdf).subarray(0, 5).toString()).toBe("%PDF-");
    expect(pdf.byteLength).toBeGreaterThan(500);
  });
});
