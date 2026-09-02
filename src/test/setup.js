import "@testing-library/jest-dom/vitest";
import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./server";

// jsdom doesn't implement ResizeObserver, but Radix UI primitives
// (Select, Slider, etc.) call it to measure elements.
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Node's own experimental `localStorage` global (present but non-functional
// without a --localstorage-file flag) shadows jsdom's implementation here,
// so plain `localStorage.getItem(...)` calls in app code (services/api.js,
// AuthContext.jsx) would otherwise silently see `undefined`. Replace it with
// a minimal in-memory Storage implementation.
class MemoryStorage {
  #store = new Map();
  getItem(key) {
    return this.#store.has(key) ? this.#store.get(key) : null;
  }
  setItem(key, value) {
    this.#store.set(key, String(value));
  }
  removeItem(key) {
    this.#store.delete(key);
  }
  clear() {
    this.#store.clear();
  }
  key(index) {
    return Array.from(this.#store.keys())[index] ?? null;
  }
  get length() {
    return this.#store.size;
  }
}

Object.defineProperty(globalThis, "localStorage", {
  value: new MemoryStorage(),
  writable: true,
  configurable: true,
});

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});
afterAll(() => server.close());
