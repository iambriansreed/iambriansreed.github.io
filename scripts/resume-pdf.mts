// Prints the built résumé page to public/Brian_Reed_Resume.pdf with headless
// Chrome, the same as File > Print on /resume, so the PDF the site serves is
// never behind the page. Run through `npm run resume:pdf`, which builds first.
//
// The page is served over HTTP (serve-dist.mts) rather than opened as a file.
// The copy in dist/ is overwritten too, so the current build and the
// committed asset agree.

import { execFile } from 'node:child_process';
import { copyFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { CHROME_CANDIDATES, DIST, ROOT, serveDist } from './serve-dist.mts';

const PDF = 'Brian_Reed_Resume.pdf';
const OUT = join(ROOT, 'public', PDF);

const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
    console.error(
        'Chrome not found. Set CHROME to the path of a Chrome or Chromium binary.',
    );
    process.exit(1);
}
if (!existsSync(join(DIST, 'resume', 'index.html'))) {
    console.error('dist/resume/index.html is missing. Run `npm run build` first.');
    process.exit(1);
}

const { server, origin } = await serveDist();
const url = `${origin}/resume/`;

// Asynchronous on purpose: a blocking spawn would stall this process's
// event loop, and the server above would never answer Chrome's requests.
execFile(
    chrome,
    [
        '--headless=new',
        '--disable-gpu',
        '--no-pdf-header-footer',
        // Let fonts and the stylesheet settle before printing.
        '--virtual-time-budget=5000',
        `--print-to-pdf=${OUT}`,
        url,
    ],
    { timeout: 60_000 },
    (error) => {
        server.close();
        if (error || !existsSync(OUT)) {
            console.error(`Chrome failed: ${error?.message ?? 'no PDF written'}`);
            process.exit(1);
        }
        copyFileSync(OUT, join(DIST, PDF));
        const kb = Math.round(statSync(OUT).size / 1024);
        console.log(`Wrote public/${PDF} (${kb} KB) from ${url}`);
    },
);
