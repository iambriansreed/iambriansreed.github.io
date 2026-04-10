import { test, expect } from '@playwright/test';

const URL = 'http://localhost:3000';

test('has title', async ({ page }) => {
    await page.goto(URL);

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Brian S. Reed - UX Engineer/);
});

// This tests the presence of the "Skills" section and verifies that it contains the expected content.
test('has skills section', async ({ page }) => {
    await page.goto(URL);

    // Check for the presence of the "Skills" section by looking for the heading.
    const skillsHeading = page.locator('h2').filter({ hasText: 'Skills' });
    await expect(skillsHeading).toBeVisible();

    // Check that the skills list contains expected items.
    const skillItems = page.locator('.skills-list li');
    await expect(skillItems).toHaveCount(5); // Assuming there are 5 skills listed.

    // Verify that specific skills are present in the list.
    await expect(skillItems).toContainText('JavaScript');
    await expect(skillItems).toContainText('React');
    await expect(skillItems).toContainText('TypeScript');
});
