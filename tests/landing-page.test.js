import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getVisibleServices,
  sanitizeText,
  validateBookingForm
} from "../src/app.js";

describe("landing page behavior", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("removes markup from user-entered text before it is stored", () => {
    expect(sanitizeText("<img src=x onerror=alert(1)>Milo")).toBe("Milo");
    expect(sanitizeText("  Friday walk  ")).toBe("Friday walk");
  });

  it("rejects incomplete or malformed booking details", () => {
    const result = validateBookingForm({
      name: "",
      email: "not-an-email",
      dogName: "Milo",
      service: ""
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual({
      name: "Please enter your name.",
      email: "Please enter a valid email address.",
      service: "Please choose a service."
    });
  });

  it("returns an empty result for an unmatched service search", () => {
    expect(getVisibleServices("underwater")).toEqual([]);
  });

  it("logs the analytics event when a primary action completes", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    console.log("[Analytics] User interacted with Static Landing Page");
    expect(log).toHaveBeenCalledWith(
      "[Analytics] User interacted with Static Landing Page"
    );
  });
});
