import { test, expect } from '@playwright/test';

test.describe('Navigation and Layout', () => {
    test.beforeEach(async ({ page }) => {
        // Mock login for navigation tests if needed, or just go to public pages
        await page.goto('/');
    });

    test('should have essential navbar links', async ({ page }) => {
        await expect(page.locator('nav')).toBeVisible();
        await expect(page.locator('text=Đăng nhập')).toBeVisible();
    });

    test('should navigate to login page', async ({ page }) => {
        await page.click('text=Đăng nhập');
        await expect(page).toHaveURL(/\/login/);
    });
});
