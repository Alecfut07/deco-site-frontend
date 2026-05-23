import { test, expect } from "@playwright/test";

test("home loads portfolio section", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#portfolio")).toBeVisible();
});
