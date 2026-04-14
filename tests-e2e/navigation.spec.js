import { test, expect } from '@playwright/test';

test.describe('Navigation and Layout', () => {
    test('should redirect to login page from root', async ({ page }) => {
        await page.goto('http://localhost:5173/');
        await expect(page).toHaveURL(/.*\/login/, { timeout: 10000 });
        await expect(page.locator('h1')).toContainText('Antigravity Intern', { timeout: 10000 });
    });
});
