import { describe, it, expect } from "vitest";
import { fetchCategories } from "../api";

describe("fetchCategories", () => {
  it("calls GET /api/categories/ and returns the response data", async () => {
    const categories = await fetchCategories();

    expect(categories).toEqual([{ id: 1, name: "Bathrooms" }]);
  });
});
