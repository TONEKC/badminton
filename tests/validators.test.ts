import { describe, expect, it } from "vitest";
import { createRegistrationSchema } from "../lib/validators";

const validPayload = {
  fullName: "Somchai Rakbadminton",
  phone: "+66812345678",
  email: "somchai@example.com",
  category: "MENS_SINGLE",
  skillLevel: "N",
  clubName: "CM Sport Club",
  password: "strongpass123",
};

describe("registration validation", () => {
  it("accepts complete applicant registration data", () => {
    const parsed = createRegistrationSchema.parse(validPayload);

    expect(parsed.email).toBe("somchai@example.com");
  });

  it("rejects invalid email and weak password", () => {
    const result = createRegistrationSchema.safeParse({
      ...validPayload,
      email: "not-email",
      password: "short",
    });

    expect(result.success).toBe(false);
  });
});
