import { describe, it, expect } from "vitest";
import { extractItems, getPaginationMeta } from "./portfolio";

describe("extractItems", () => {
  it("returns empty array for null payload", () => {
    expect(extractItems(null)).toEqual([]);
  });

  it("reads portfolio_items from API shape", () => {
    const payload = {
      portfolio_items: [{ id: 1, title: "Kitchen" }],
      pagination: { count: 1 },
    };
    expect(extractItems(payload)).toHaveLength(1);
    expect(extractItems(payload)[0].title).toBe("Kitchen");
  });

  it("reads results array", () => {
    expect(extractItems({ results: [{ id: 2 }] })).toHaveLength(1);
  });
});

describe("getPaginationMeta", () => {
  it("normalizes backend pagination fields", () => {
    const meta = getPaginationMeta(
      {
        portfolio_items: [{ id: 1 }],
        pagination: {
          current_page: 2,
          total_items: 24,
          total_pages: 2,
          has_next: false,
          has_previous: true,
        },
      },
      2,
      12,
    );

    expect(meta.page).toBe(2);
    expect(meta.count).toBe(24);
    expect(meta.has_previous).toBe(true);
    expect(meta.has_next).toBe(false);
  });
});
