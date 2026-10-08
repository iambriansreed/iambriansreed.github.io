/* The accent and theme toggles from the home page, without the rest of its
   client. Same storage keys and same rule: a preference is only saved once the
   home page's cookie bar has been accepted (localStorage `cookie` = "true").
   This page has no cookie bar, so without consent the toggles work for the
   visit and are forgotten. The shell's inline script restores both on load.

   ACCENTS is a copy of the list in src/client.ts (and the Accent type in
   global.d.ts). Pages bundle their own client, so keep the three in step. */

(() => {
    const html = document.documentElement;
    const themeBtn =
        document.querySelector<HTMLButtonElement>('.theme-toggle')!;
    const accentBtn =
        document.querySelector<HTMLButtonElement>('.accent-toggle')!;

    const ACCENTS: readonly Accent[] = [
        '#7a8a3a',
        '#5a8a6a',
        '#4a7fa5',
        '#c97a3a',
        '#b5542a',
        '#b56070',
        '#7a5a9a',
        '#3a8a8a',
    ];

    const REDUCE_MOTION = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
    ).matches;

    let theme: Theme = html.dataset.theme === 'light' ? 'light' : 'dark';
    const storedAccent = localStorage.getItem('accent') as Accent | null;
    let accent: Accent =
        storedAccent && ACCENTS.includes(storedAccent)
            ? storedAccent
            : ACCENTS[0];

    // Functional preferences; no consent needed (see the home page client).
    function persist(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    // The banner and figures carry both theme variants as data-light and
    // data-dark and no src (see ThemedImg in index.tsx), so only the current
    // theme's file is ever requested. A figure's link follows its image.
    const themedImgs = document.querySelectorAll<HTMLImageElement>(
        'img[data-light][data-dark]',
    );

    function showThemedImgs() {
        for (const img of themedImgs) {
            const src = img.dataset[theme]!;
            img.src = src;
            const link = img.closest('a');
            if (link) link.href = src;
        }
    }

    function setTheme(next: Theme) {
        theme = next;
        html.dataset.theme = theme;
        persist('theme', theme);
        showThemedImgs();
    }

    showThemedImgs();

    function setAccent(next: Accent) {
        accent = next;
        html.style.setProperty('--accent', accent);
        persist('accent', accent);
    }

    themeBtn.addEventListener('click', () => {
        const next: Theme = theme === 'dark' ? 'light' : 'dark';

        if (REDUCE_MOTION || !document.startViewTransition) {
            setTheme(next);
            return;
        }

        // Target theme drives the wipe direction (see ::view-transition in style.css).
        html.dataset.themeSwitch = next;
        const transition = document.startViewTransition(() => setTheme(next));
        transition.finished.finally(() => delete html.dataset.themeSwitch);
    });

    accentBtn.addEventListener('click', () => {
        setAccent(ACCENTS[(ACCENTS.indexOf(accent) + 1) % ACCENTS.length]);
    });
})();
