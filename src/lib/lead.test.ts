import { describe, it, expect } from "vitest";
import { normalizePlPhone, validateLead } from "./lead";

describe("normalizePlPhone", () => {
  it("formats 9 digits", () => expect(normalizePlPhone("600123456")).toBe("+48 600 123 456"));
  it("accepts +48, spaces and dashes", () => expect(normalizePlPhone("+48 600-123 456")).toBe("+48 600 123 456"));
  it("rejects 8 digits", () => expect(normalizePlPhone("60012345")).toBeNull());
});

describe("validateLead", () => {
  const ok = { name: "Ola", phone: "600123456", email: "a@b.pl", about: "", consentContact: true, consentRodo: true };
  it("passes with only required fields", () => expect(validateLead(ok)).toEqual({}));
  it("requires both consents", () => {
    const e = validateLead({ ...ok, consentContact: false, consentRodo: false });
    expect(e.consentContact).toBeDefined();
    expect(e.consentRodo).toBeDefined();
  });
  it("limits about to 1000 chars", () => expect(validateLead({ ...ok, about: "x".repeat(1001) }).about).toBeDefined());
});
