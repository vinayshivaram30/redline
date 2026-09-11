import { test, expect } from "@playwright/test";
import path from "node:path";

// Same pre-confirmed fixture user as e2e/auth.spec.ts.
const FIXTURE_EMAIL = "redline-e2e-probe-1@gmail.com";
const FIXTURE_PASSWORD = "testpassword123";

test("uploading a real PDF extracts text client-side and saves it", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill(FIXTURE_EMAIL);
  await page.getByPlaceholder("Password").fill(FIXTURE_PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/documents/);

  await page.goto("/documents/upload");
  await page.locator('input[type="file"]').setInputFiles(
    path.join(__dirname, "../tests/parsing/fixtures/sample.pdf"),
  );
  await page.getByRole("button", { name: "Upload" }).click();

  // Redirects to /documents on success - if extraction or the insert (RLS
  // included) had failed, the error paragraph would show instead.
  await expect(page).toHaveURL(/\/documents$/);
});
