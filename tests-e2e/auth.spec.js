import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should login successfully as intern', async ({ page }) => {
        await page.goto('/login');

        // Fill login form
        await page.fill('input[type="email"]', 'intern@example.com');
        await page.fill('input[type="password"]', 'password123');

        // Click login button
        await page.click('button[type="submit"]');

        // Should be redirected to intern dashboard
        await expect(page).toHaveURL(/.*\/intern/);
        await expect(page.locator('h1')).toContainText('Bảng điều khiển');
    });

    test('should show error on wrong credentials', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[type="email"]', 'wrong@example.com');
        await page.fill('input[type="password"]', 'wrongpass');
        await page.click('button[type="submit"]');

        // Should show error message
        await expect(page.locator('.text-destructive')).toBeVisible();
    });
});
