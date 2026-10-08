// Built to dist/404/index.html; the build script copies it to dist/404.html,
// the file GitHub Pages serves for any path it cannot find. Every URL on the
// page is root-relative (skrapa rewrites ./style.css to /404/style.css), so the
// copy works at whatever depth the missing path was.
export function Page(): Skrapa.Page {
    return (
        <main class="hero not-found">
            <h1 class="hero-name" aria-label="404, page not found">
                404
                <span class="hero-name-dot" aria-hidden="true"></span>
            </h1>
            <p class="not-found-text">That page moved or never existed.</p>
            <div class="hero-actions">
                <a class="btn btn-primary" href="/">
                    Home
                </a>
                <a class="btn" href="/resume">
                    Résumé
                </a>
            </div>
        </main>
    );
}
