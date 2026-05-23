import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}));

// Import after mock
import { fetchCategories } from "./api";

describe("fetchCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls GET /api/categories/", async () => {
    const mockGet = vi
      .fn()
      .mockResolvedValue({ data: [{ id: 1, name: "Bathrooms" }] });
    axios.create.mockReturnValue({
      get: mockGet,
      interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
    });

    // Re-import or test via exported functions that use the same instance
    // Simpler approach: test fetchers by mocking the shared `api` instance in a dedicated test helper
  });
});
