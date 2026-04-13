import { expect, test, type Locator, type Page } from "@playwright/test";

const maybeClick = async (locator: Locator): Promise<boolean> => {
  if ((await locator.count()) === 0) {
    return false;
  }

  const target = locator.first();
  if (!(await target.isVisible()) || !(await target.isEnabled())) {
    return false;
  }

  await target.click();
  return true;
};

const loginToDemo = async (page: Page): Promise<void> => {
  await page.goto("/auth");
  await page.getByLabel("Email").fill(`aggressive.${Date.now()}@devhouse.app`);
  await page.getByLabel("PIN (required)").fill("2026");

  await Promise.all([
    page.waitForURL(/\/dashboard$/, { timeout: 20_000 }),
    page.getByRole("button", { name: /Enter Demo Workspace/i }).click(),
  ]);
};

test("aggressive feature regression sweep", async ({ page }) => {
  await loginToDemo(page);
  await expect(page.getByRole("heading", { name: /Subscriptions Overview/i })).toBeVisible();

  await page.getByRole("button", { name: /^Refresh$/i }).first().click();

  await page.getByRole("link", { name: /View Detail/i }).first().click();
  await expect(page).toHaveURL(/\/subscriptions\//);

  await maybeClick(page.getByRole("button", { name: /Start Cancellation/i }));
  await maybeClick(page.getByRole("button", { name: /Mark as Completed/i }));
  await maybeClick(page.getByRole("button", { name: /Enable Auto-block|Disable Auto-block/i }));

  await page.getByRole("link", { name: /Back to Dashboard/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByRole("link", { name: /Cancellation Center/i }).first().click();
  await expect(page).toHaveURL(/\/cancellations$/);
  await expect(page.getByRole("heading", { name: /Guided Cancellation Queue/i })).toBeVisible();
  await maybeClick(page.locator("button.cta-primary:not([disabled])"));

  await page.getByRole("link", { name: /Protection Controls/i }).first().click();
  await expect(page).toHaveURL(/\/protection$/);
  await expect(page.getByRole("heading", { name: /Auto-Block Matrix/i })).toBeVisible();
  await maybeClick(page.getByRole("button", { name: /Enable Auto-Block|Disable Auto-Block/i }));

  await page.getByRole("link", { name: /Dispute Studio/i }).first().click();
  await expect(page).toHaveURL(/\/disputes$/);
  await expect(page.getByRole("heading", { name: /Dispute Studio/i })).toBeVisible();

  if (await maybeClick(page.getByRole("link", { name: /Open Detail/i }))) {
    await expect(page).toHaveURL(/\/subscriptions\//);
    await page.goBack();
    await expect(page).toHaveURL(/\/disputes$/);
  }

  await page.getByRole("link", { name: /Alerts Feed/i }).first().click();
  await expect(page).toHaveURL(/\/alerts$/);
  await expect(page.getByRole("heading", { name: /Incident Timeline/i })).toBeVisible();

  if (await maybeClick(page.locator("article a.cta-primary"))) {
    await expect(page).not.toHaveURL(/\/alerts$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/alerts$/);
  }

  await page.getByRole("link", { name: /Renewal Calendar/i }).first().click();
  await expect(page).toHaveURL(/\/renewals$/);
  await expect(page.getByRole("heading", { name: /Renewal Calendar/i })).toBeVisible();
  await expect(page.getByText(/Charge Timeline/i)).toBeVisible();

  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: /Subscriptions Overview/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Logout$/i })).toBeVisible();
});
