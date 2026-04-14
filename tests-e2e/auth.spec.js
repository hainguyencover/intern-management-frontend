import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should login successfully as intern', async ({ page }) => {
        page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
        page.on('pageerror', exception => console.log(`Uncaught exception: "${exception}"`));
        await page.goto('http://localhost:5173/login');

        // Fill login form
        await page.fill('input[type="email"]', 'intern@student.com');
        await page.fill('input[type="password"]', 'intern123');

        // Click login button
        await page.click('button:has-text("Đăng nhập ngay")');

        // Should be redirected to intern dashboard
        await expect(page).toHaveURL(/.*\/dashboard\/intern/, { timeout: 15000 });
        await expect(page.locator('h1')).toContainText('Chào mừng trở lại', { timeout: 10000 });
    });

    test('should show error on wrong credentials', async ({ page }) => {
        await page.goto('http://localhost:5173/login');

        await page.fill('input[type="email"]', 'wrong@example.com');
        await page.fill('input[type="password"]', 'wrongpass');
        await page.click('button:has-text("Đăng nhập ngay")');

        // Should show error message (error div with text-destructive class)
        await expect(page.locator('.text-destructive')).toBeVisible({ timeout: 10000 });
    });
});
