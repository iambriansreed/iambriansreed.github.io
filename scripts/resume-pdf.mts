// Prints the built résumé page to public/Brian_Reed_Resume.pdf with headless
// Chrome, the same as File > Print on /resume, so the PDF the site serves is
// never behind the page. Run through `npm run resume:pdf`, which builds first.
//
// The page is served over HTTP rather than opened as a file: the built HTML
// carries a <base href="/"> and root-relative asset paths that file:// cannot
// resolve. The copy in dist/ is overwritten too, so the current build and the
// committed asset agree.

import { execFile } from 'node:child_process';
import { copyFileSync, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');
const PDF = 'Brian_Reed_Resume.pdf';
const OUT = join(ROOT, 'public', PDF);

const TYPES: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.woff2': 'font/woff2',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
};

const CHROME_CANDIDATES = [
    process.env.CHROME,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
].filter((p): p is string => !!p);

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

// A minimal static server over dist/: extensionless paths map to index.html.
const server = createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    let file = join(DIST, decodeURIComponent(url.pathname));
    if (!file.startsWith(DIST)) {
        res.writeHead(403).end();
        return;
    }
    if (!extname(file)) file = join(file, 'index.html');
    try {
        const body = readFileSync(file);
        res.writeHead(200, {
            'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
        });
        res.end(body);
    } catch {
        res.writeHead(404).end();
    }
});

server.listen(0, '127.0.0.1', () => {
    const address = server.address();
    const port = typeof address === 'object' && address ? address.port : 0;
    const url = `http://127.0.0.1:${port}/resume/`;

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
                console.error(
                    `Chrome failed: ${error?.message ?? 'no PDF written'}`,
                );
                process.exit(1);
            }
            copyFileSync(OUT, join(DIST, PDF));
            const kb = Math.round(statSync(OUT).size / 1024);
            console.log(`Wrote public/${PDF} (${kb} KB) from ${url}`);
        },
    );
});
