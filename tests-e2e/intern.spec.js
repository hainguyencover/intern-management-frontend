import { test, expect } from '@playwright/test';

test.describe('Intern Workflow', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate and login
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', 'intern@student.com');
    await page.fill('input[type="password"]', 'intern123');
    await page.click('button:has-text("Đăng nhập ngay")');
    // Ensure we are logged in by waiting for intern dashboard
    await expect(page).toHaveURL(/.*\/dashboard\/intern/, { timeout: 15000 });
  });

  test('should login as intern, view dashboard, and navigate to attendance', async ({ page }) => {
    // Check Dashboard h1
    await expect(page.locator('h1')).toContainText('Chào mừng trở lại', { timeout: 10000 });

    // Navigate to Attendance
    await page.goto('http://localhost:5173/intern/attendance');
    await expect(page).toHaveURL(/.*\/intern\/attendance/, { timeout: 10000 });

    // Check attendance page heading
    await expect(page.locator('h1')).toContainText('Chấm công', { timeout: 10000 });
  });

  test('should view assigned tasks page', async ({ page }) => {
    // Navigate to Tasks
    await page.goto('http://localhost:5173/intern/tasks');
    await expect(page).toHaveURL(/.*\/intern\/tasks/, { timeout: 10000 });

    // Check tasks page content exists (page header text)
    await expect(page.locator('text=My Tasks')).toBeVisible({ timeout: 10000 });
  });

  test('should view weekly report page', async ({ page }) => {
    // Navigate to Reports
    await page.goto('http://localhost:5173/intern/reports/weekly/submit');
    await expect(page).toHaveURL(/.*\/intern\/reports\/weekly\/submit/, { timeout: 10000 });

    // Check weekly report page heading
    await expect(page.locator('h1')).toContainText('Báo cáo tuần', { timeout: 10000 });
  });

});
