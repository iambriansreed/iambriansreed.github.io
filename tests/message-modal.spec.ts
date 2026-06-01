import { test, expect } from '@playwright/test';

const URL = 'http://localhost:3000';

test.describe('Message modal', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(URL);
        await page.click('[data-msg-open]');
        await expect(page.locator('#msg-modal')).toHaveClass(/is-open/);
    });

    test('shows default hint on open', async ({ page }) => {
        await expect(page.locator('#msg-hint')).toHaveText(
            'Enter your email and write your message.',
        );
    });

    test('shows nice email hint when valid email is entered', async ({ page }) => {
        await page.fill('#msg-email', 'test@example.com');
        await expect(page.locator('#msg-hint')).toHaveText(
            'Nice email! Now write your message.',
        );
    });

    test('shows invalid email hint after debounce when email looks wrong', async ({ page }) => {
        await page.fill('#msg-email', 'notanemail');
        await page.waitForTimeout(1400);
        await expect(page.locator('#msg-hint')).toHaveText(
            "That doesn't look like a valid email.",
        );
    });

    test('shows short message hint when message is under 60 chars', async ({ page }) => {
        await page.fill('#msg-textarea', 'Hey there');
        await expect(page.locator('#msg-hint')).toHaveText(
            'Why not tell me a little more?',
        );
    });

    test('shows multi-paragraph hint when message has multiple paragraphs', async ({ page }) => {
        await page.fill('#msg-textarea', 'First paragraph.\n\nSecond paragraph here.');
        await expect(page.locator('#msg-hint')).toHaveText(
            'Multiple paragraphs — I like it!',
        );
    });

    test('shows spam warning when a large blob of text is pasted', async ({ page }) => {
        const blob = 'a'.repeat(350);
        await page.locator('#msg-textarea').focus();
        await page.evaluate((text) => {
            const ta = document.getElementById('msg-textarea') as HTMLTextAreaElement;
            const dt = new DataTransfer();
            dt.setData('text/plain', text);
            ta.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true }));
            ta.value = text;
            ta.dispatchEvent(new Event('input', { bubbles: true }));
        }, blob);
        await expect(page.locator('#msg-hint')).toHaveText(
            "Whoa, that's a lot. Are you spamming me?",
        );
    });

    test('shows missing email hint when send is clicked without email', async ({ page }) => {
        await page.fill('#msg-textarea', 'Hello there, I would like to get in touch with you about something.');
        await page.click('#msg-send');
        await expect(page.locator('#msg-hint')).toHaveText("Don't forget your email!");
    });

    test('clears spam warning when user types in textarea after paste', async ({ page }) => {
        const blob = 'a'.repeat(350);
        await page.evaluate((text) => {
            const ta = document.getElementById('msg-textarea') as HTMLTextAreaElement;
            const dt = new DataTransfer();
            dt.setData('text/plain', text);
            ta.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true }));
        }, blob);
        await page.locator('#msg-textarea').pressSequentially(' edited');
        await expect(page.locator('#msg-hint')).not.toHaveText(
            "Whoa, that's a lot. Are you spamming me?",
        );
    });
});
