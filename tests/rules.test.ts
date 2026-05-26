import { afterEach, describe, expect, it } from "vitest";
import { assertRegistrationOpen, isRegistrationOpen } from "../lib/rules";

const originalCloseAt = process.env.REGISTRATION_CLOSE_AT;

afterEach(() => {
  process.env.REGISTRATION_CLOSE_AT = originalCloseAt;
});

describe("registration deadline rules", () => {
  it("allows applicant changes before the deadline", () => {
    process.env.REGISTRATION_CLOSE_AT = "2026-06-01T00:00:00.000Z";

    expect(isRegistrationOpen(new Date("2026-05-31T23:59:59.000Z"))).toBe(true);
  });

  it("blocks applicant changes after the deadline", () => {
    process.env.REGISTRATION_CLOSE_AT = "2026-06-01T00:00:00.000Z";

    expect(isRegistrationOpen(new Date("2026-06-01T00:00:01.000Z"))).toBe(false);
    expect(() =>
      assertRegistrationOpen(new Date("2026-06-01T00:00:01.000Z")),
    ).toThrow("Registration deadline has passed");
  });
});
