import { test, expect } from "@playwright/test";

test("home loads portfolio section", async ({ page }) => {
  await page.goto("http://68.183.111.50/");
  await expect(page.locator("#portfolio")).toBeVisible();
});
