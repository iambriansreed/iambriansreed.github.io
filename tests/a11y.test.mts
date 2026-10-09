// Runs axe-core over every built page in the Chrome already installed on the
// machine (puppeteer-core attaches to it, so nothing is downloaded). The pages
// that restore a theme and accent from localStorage are checked under both
// themes and every accent, by writing the same keys the shell's inline script
// reads before first paint, so the real restore path is what gets tested.
// Resting state only: hover and focus styles are not exercised.
//
// Run through `npm test`, which builds first. Needs `dist/` and a Chrome binary
// (CHROME overrides the search list in serve-dist.mts).

import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { after, before, describe, test } from 'node:test';
import puppeteer, { type Browser, type Page } from 'puppeteer-core';
import type { AxeResults, Result } from 'axe-core';
import { CHROME_CANDIDATES, DIST, serveDist } from '../scripts/serve-dist.mts';
import { ACCENTS } from '../src/accents.ts';

const AXE_PATH = createRequire(import.meta.url).resolve('axe-core/axe.min.js');
const THEMES = ['dark', 'light'] as const;
// Every rule in these tags, color-contrast included.
const RULE_TAGS = ['wcag2a', 'wcag2aa'];

/** Pages whose shell restores theme and accent from localStorage. */
const THEMED_PAGES = ['/', '/bspk/', '/404/'];
/** Single-theme pages with no accent. */
const PLAIN_PAGES = ['/resume/', '/chores/'];

const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
    throw new Error(
        'Chrome not found. Set CHROME to the path of a Chrome or Chromium binary.',
    );
}
if (!existsSync(join(DIST, 'index.html'))) {
    throw new Error('dist/index.html is missing. Run `npm run build` first.');
}

function formatViolations(violations: Result[]): string {
    return violations
        .map((v) => {
            const nodes = v.nodes
                .map((n) => `    ${n.target.join(' ')}\n      ${n.failureSummary}`)
                .join('\n');
            return `  [${v.impact}] ${v.id}: ${v.help} (${v.helpUrl})\n${nodes}`;
        })
        .join('\n');
}

async function audit(page: Page, url: string, prefs: Record<string, string>) {
    // Runs before any page script on every navigation, so the shell's inline
    // restore sees these the same way it would see a visitor's saved choice.
    await page.evaluateOnNewDocument((entries: [string, string][]) => {
        localStorage.clear();
        for (const [k, v] of entries) localStorage.setItem(k, v);
    }, Object.entries(prefs));
    await page.goto(url, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.addScriptTag({ path: AXE_PATH });
    const results = (await page.evaluate(
        (tags: string[]) => axe.run(document, { runOnly: { type: 'tag', values: tags } }),
        RULE_TAGS,
    )) as AxeResults;
    assert.equal(
        results.violations.length,
        0,
        `${url} with ${JSON.stringify(prefs)} has ${results.violations.length} axe violation(s):\n${formatViolations(results.violations)}`,
    );
}

describe('a11y - every built page passes axe WCAG 2 A and AA', () => {
    let browser: Browser;
    let page: Page;
    let server: Awaited<ReturnType<typeof serveDist>>;

    before(async () => {
        server = await serveDist();
        browser = await puppeteer.launch({ executablePath: chrome, headless: true });
        page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 900 });
    });

    after(async () => {
        await browser?.close();
        server?.server.close();
    });

    for (const path of PLAIN_PAGES) {
        test(`${path} passes`, async () => {
            await audit(page, server.origin + path, {});
        });
    }

    for (const path of THEMED_PAGES) {
        for (const theme of THEMES) {
            for (const accent of ACCENTS) {
                test(`${path} passes in ${theme} theme with accent ${accent}`, async () => {
                    await audit(page, server.origin + path, { theme, accent });
                });
            }
        }
    }
});

// axe is injected into the page by addScriptTag; this only types the global
// inside page.evaluate callbacks.
declare const axe: typeof import('axe-core');
