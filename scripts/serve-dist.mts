// A minimal static server over dist/, shared by the résumé PDF script and the
// a11y test. The built HTML carries a <base href="/"> and root-relative asset
// paths that file:// cannot resolve, so anything driving a browser over the
// build has to serve it. Extensionless paths map to index.html.

import { readFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { extname, join, resolve } from 'node:path';

export const ROOT = resolve(import.meta.dirname, '..');
export const DIST = join(ROOT, 'dist');

export const CHROME_CANDIDATES = [
    process.env.CHROME,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
].filter((p): p is string => !!p);

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

/** Serves dist/ on a free loopback port and resolves to the server and its origin. */
export function serveDist(): Promise<{ server: Server; origin: string }> {
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
    return new Promise((done) => {
        server.listen(0, '127.0.0.1', () => {
            const address = server.address();
            const port = typeof address === 'object' && address ? address.port : 0;
            done({ server, origin: `http://127.0.0.1:${port}` });
        });
    });
}
