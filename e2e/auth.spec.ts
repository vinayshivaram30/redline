import { test, expect } from "@playwright/test";

// Fixture user, pre-confirmed directly in the dev Supabase project (email
// confirmation is required by default, so signup alone can't produce a
// logged-in session in a test run). See PIPELINE.md for the project ref.
const FIXTURE_EMAIL = "redline-e2e-probe-1@gmail.com";
const FIXTURE_PASSWORD = "testpassword123";

test("unauthenticated user visiting /documents is redirected to /login", async ({ page }) => {
  await page.goto("/documents");
  await expect(page).toHaveURL(/\/login/);
});

test("signup shows a check-your-email message (confirmation required)", async ({ page }) => {
  // Supabase's built-in email sender rate-limits signups (a handful per
  // hour), which makes hitting it for real on every test run flaky. This
  // stubs the signup response to the no-session shape Supabase returns when
  // email confirmation is pending, so the test verifies our UI branch
  // (see lib/supabase/auth.ts signUp) without depending on mail quota.
  await page.route("**/auth/v1/signup**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "00000000-0000-0000-0000-000000000000",
        email: "stubbed@example.com",
        confirmation_sent_at: new Date().toISOString(),
        // no access_token/session field, matching a pending-confirmation signup
      }),
    }),
  );

  await page.goto("/signup");
  await page.getByPlaceholder("Email").fill("stubbed@example.com");
  await page.getByPlaceholder("Password").fill("testpassword123");
  await page.getByRole("button", { name: "Sign up" }).click();
  await expect(page.getByText("Check your email")).toBeVisible();
});

test("login with a confirmed user reaches /documents, logout returns to /login", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill(FIXTURE_EMAIL);
  await page.getByPlaceholder("Password").fill(FIXTURE_PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/documents/);
  await expect(page.getByRole("heading", { name: "Documents" })).toBeVisible();

  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/login/);
});
