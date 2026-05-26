import { describe, expect, it } from "vitest";
import { makeReferenceCode } from "../lib/reference";

describe("reference code generation", () => {
  it("generates stable tournament reference code format", () => {
    const referenceCode = makeReferenceCode(
      new Date("2026-05-27T00:00:00.000Z"),
      0.5,
    );

    expect(referenceCode).toMatch(/^BDM-2026-[A-Z0-9]{6}$/);
  });
});
