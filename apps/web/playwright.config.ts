import { defineConfig, devices } from "@playwright/test";

const isCi = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  workers: isCi ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: [
    {
      command: "npm --prefix ../api run dev",
      url: "http://127.0.0.1:4000/health",
      reuseExistingServer: !isCi,
      timeout: 120_000,
    },
    {
      command: "npm run dev",
      url: "http://127.0.0.1:3000/auth",
      reuseExistingServer: !isCi,
      timeout: 120_000,
      env: {
        NEXT_PUBLIC_API_BASE_URL: "http://127.0.0.1:4000",
      },
    },
  ],
});
