import { expect, test } from "@playwright/test";

test("judge demo journey covers Vishwas screens", async ({ page }) => {
  await page.goto("/auth");

  await expect(page.getByRole("heading", { name: /Secure demo access/i })).toBeVisible();

  await page.getByLabel("Email").fill(`judge.${Date.now()}@devhouse.app`);
  await page.getByLabel("PIN (required)").fill("2026");
  await Promise.all([
    page.waitForURL(/\/dashboard$/, { timeout: 20_000 }),
    page.getByRole("button", { name: /Enter Demo Workspace/i }).click(),
  ]);

  await expect(page.getByRole("heading", { name: /Subscriptions Overview/i })).toBeVisible();

  await page.getByRole("link", { name: /Cancellation Center/i }).first().click();
  await expect(page).toHaveURL(/\/cancellations$/);
  await expect(page.getByRole("heading", { name: /Guided Cancellation Queue/i })).toBeVisible();

  await page.getByRole("link", { name: /Protection Controls/i }).first().click();
  await expect(page).toHaveURL(/\/protection$/);
  await expect(page.getByRole("heading", { name: /Auto-Block Matrix/i })).toBeVisible();

  await page.getByRole("link", { name: /Dispute Studio/i }).first().click();
  await expect(page).toHaveURL(/\/disputes$/);
  await expect(page.getByRole("heading", { name: /Dispute Studio/i })).toBeVisible();

  await page.getByRole("link", { name: /Alerts Feed/i }).first().click();
  await expect(page).toHaveURL(/\/alerts$/);
  await expect(page.getByRole("heading", { name: /Incident Timeline/i })).toBeVisible();

  await expect(page.getByText(/Action guidance/i).first()).toBeVisible();
});
