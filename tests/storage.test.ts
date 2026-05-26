import { describe, expect, it } from "vitest";
import { createStoragePath } from "../lib/storage";

describe("storage path generation", () => {
  it("does not include unsafe original filename characters in object keys", () => {
    const storagePath = createStoragePath(
      "cmpmztk0g000004l7fdi7mg5f",
      "Ayutthaya Thai Wellness logo-แยก-02.png",
    );

    expect(storagePath).toMatch(
      /^cmpmztk0g000004l7fdi7mg5f\/[0-9]+-[0-9a-f-]+\.png$/,
    );
    expect(storagePath).not.toContain(" ");
    expect(storagePath).not.toContain("แยก");
  });
});
