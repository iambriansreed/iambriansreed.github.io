/* The accent and theme controls (markup in appearance.tsx, styles in
   appearance.css). Each page bundles its own client, so every client calls
   initAppearance() once and skrapa inlines this module into each bundle.

   Controls are found by class, however many a page has and wherever they sit:
   .accent-toggle cycles the accent (click; three quick clicks spin; arrow keys
   step; long press or right-click opens the swatch pop-over), .theme-toggle
   flips the theme, .theme-choice picks one and .accent-swatch picks an accent.

   Theme and accent are functional preferences kept in localStorage, which needs
   no consent, so they are always persisted. One key per preference, and every
   change goes through a setter that owns both the DOM and storage, so the two
   cannot drift. The shell's inline script restores both before first paint;
   this module only re-reads what it set. */
import { ACCENTS } from './accents';

const HOLD_MS = 450;
const WIPE_MS = 650;
const WIPE_EASING = 'cubic-bezier(0.65, 0, 0.35, 1)';
const POP_GAP = 8;

const all = <T extends Element = HTMLElement>(selector: string) =>
    Array.from(document.querySelectorAll<T>(selector));

export function initAppearance({
    onTheme,
}: {
    /** Runs after every theme change, including the initial one. */
    onTheme?: (theme: Theme) => void;
} = {}) {
    const html = document.documentElement;
    const accentToggles = all<HTMLButtonElement>('.accent-toggle');
    const themeToggles = all<HTMLButtonElement>('.theme-toggle');
    const themeChoices = all<HTMLButtonElement>('.theme-choice');

    const REDUCE_MOTION = matchMedia(
        '(prefers-reduced-motion: reduce)',
    ).matches;

    // ── State ─────────────────────────────────────────────────────────────────

    let theme: Theme = html.dataset.theme === 'light' ? 'light' : 'dark';
    const storedAccent = localStorage.getItem('accent') as Accent | null;
    let accent: Accent =
        storedAccent && ACCENTS.includes(storedAccent)
            ? storedAccent
            : ACCENTS[0];

    function setTheme(next: Theme, save = true) {
        theme = next;
        html.dataset.theme = next;
        if (save) localStorage.setItem('theme', next);
        for (const b of themeChoices) {
            b.setAttribute(
                'aria-pressed',
                String(b.dataset.themeChoice === next),
            );
        }
        onTheme?.(next);
    }

    function setAccent(next: Accent, save = true) {
        accent = next;
        html.style.setProperty('--accent', next);
        if (save) localStorage.setItem('accent', next);
        for (const b of all<HTMLButtonElement>('.accent-swatch')) {
            b.setAttribute('aria-pressed', String(b.dataset.accent === next));
        }
    }

    // ── Wipe ──────────────────────────────────────────────────────────────────
    // A change spreads across the page as a circle growing out of the control
    // that made it. View Transitions snapshot the old page; appearance.css
    // turns off the default cross-fade and this clips the new snapshot in. The
    // radius reaches the farthest viewport corner so nothing is left uncovered.
    //
    // An accent change on its own moves too few pixels for the wipe to read,
    // so a ring in the new accent (.wipe-edge) travels just inside the clip
    // edge, drawn in the live DOM the new snapshot shows. Both animations
    // share their timing, so the ring stays on the edge.
    function wipeFrom(origin: HTMLElement, apply: () => void) {
        if (REDUCE_MOTION || !document.startViewTransition) {
            apply();
            return;
        }
        const rect = origin.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const radius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y),
        );
        const timing = { duration: WIPE_MS, easing: WIPE_EASING };

        const edge = document.createElement('div');
        edge.className = 'wipe-edge';
        edge.style.left = `${x}px`;
        edge.style.top = `${y}px`;

        const transition = document.startViewTransition(() => {
            apply();
            document.body.append(edge);
        });
        transition.ready
            .then(() => {
                html.animate(
                    {
                        clipPath: [
                            `circle(0 at ${x}px ${y}px)`,
                            `circle(${radius}px at ${x}px ${y}px)`,
                        ],
                    },
                    { ...timing, pseudoElement: '::view-transition-new(root)' },
                );
                // Kept a few pixels inside the clip so its band stays visible.
                const inner = radius - 4;
                edge.animate(
                    {
                        width: ['0px', `${inner * 2}px`],
                        height: ['0px', `${inner * 2}px`],
                    },
                    timing,
                );
            })
            // Rejects when a newer transition skipped this one; nothing to do.
            .catch(() => {});
        transition.finished.finally(() => edge.remove());
    }

    // ── Accent ────────────────────────────────────────────────────────────────

    // The pressed toggle dabs its brush (or pops, for the hero dot); see the
    // .is-painting keyframes in appearance.css.
    function flick(btn: HTMLElement) {
        btn.classList.remove('is-painting');
        void btn.offsetWidth;
        btn.classList.add('is-painting');
    }
    for (const btn of accentToggles) {
        btn.addEventListener('animationend', () =>
            btn.classList.remove('is-painting'),
        );
    }

    /** Move `delta` accents along the list from `origin`, wiping unless told not to. */
    function cycleAccent(origin: HTMLElement, delta: number, animate = true) {
        const len = ACCENTS.length;
        const next = ACCENTS[(ACCENTS.indexOf(accent) + delta + len) % len];
        const apply = () => setAccent(next);
        if (!animate) {
            apply();
            return;
        }
        flick(origin);
        wipeFrom(origin, apply);
    }

    /** Jump straight to an accent, wiping out from the swatch pressed. */
    function pickAccent(origin: HTMLElement, next: Accent) {
        if (next === accent) return;
        wipeFrom(origin, () => setAccent(next));
    }

    // Three quick clicks kick off a slot-machine spin: accents flicker fast,
    // ease out, and land on a random colour, which then wipes across.
    let accentClicks: number[] = [];
    let accentSpinning = false;

    function spinAccent(origin: HTMLElement) {
        accentSpinning = true;
        origin.classList.add('spinning');
        const len = ACCENTS.length;
        const startIdx = ACCENTS.indexOf(accent);
        const target = Math.floor(Math.random() * len);
        // Two full loops, then advance to the random target (~16-23 flips).
        const steps = len * 2 + ((target - startIdx + len) % len);
        let step = 0;
        const tick = () => {
            step += 1;
            if (step >= steps) {
                accentSpinning = false;
                origin.classList.remove('spinning');
                cycleAccent(origin, 1);
                return;
            }
            cycleAccent(origin, 1, false);
            // Whips fast (~28ms) for most of the spin, then the steep ease-out
            // (pow 4) draws the final flips out to ~530ms for a slow, teasing stop.
            const delay = 28 + Math.pow(step / steps, 4) * 500;
            window.setTimeout(tick, delay);
        };
        tick();
    }

    // ── Swatches ──────────────────────────────────────────────────────────────
    // The footer row is rendered at build time; the pop-over a toggle opens on
    // long press or right-click is built here from the same list.

    function bindSwatches(root: ParentNode) {
        for (const b of root.querySelectorAll<HTMLButtonElement>(
            '.accent-swatch',
        )) {
            b.addEventListener('click', () => {
                pickAccent(b, b.dataset.accent as Accent);
                closePalette();
            });
        }
    }
    bindSwatches(document);

    const palette = document.createElement('div');
    palette.className = 'accent-palette';
    palette.hidden = true;
    palette.setAttribute('role', 'group');
    palette.setAttribute('aria-label', 'Accent color');
    palette.append(
        ...ACCENTS.map((hex, i) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'accent-swatch';
            b.dataset.accent = hex;
            b.style.setProperty('--swatch', hex);
            b.style.setProperty('--i', String(i));
            b.setAttribute(
                'aria-label',
                `Accent ${i + 1} of ${ACCENTS.length}`,
            );
            return b;
        }),
    );
    document.body.append(palette);
    bindSwatches(palette);
    let paletteOwner: HTMLButtonElement | null = null;

    /** Show the pop-over under `owner`, or above it when there is no room. */
    function openPalette(owner: HTMLButtonElement) {
        if (!palette.hidden) return;
        paletteOwner = owner;
        palette.hidden = false;
        owner.setAttribute('aria-expanded', 'true');
        const o = owner.getBoundingClientRect();
        const p = palette.getBoundingClientRect();
        let top = o.bottom + POP_GAP;
        if (top + p.height > innerHeight - POP_GAP)
            top = o.top - POP_GAP - p.height;
        const left = Math.min(
            Math.max(POP_GAP, o.left + o.width / 2 - p.width / 2),
            innerWidth - p.width - POP_GAP,
        );
        palette.style.top = `${top}px`;
        palette.style.left = `${left}px`;
        const current = palette.querySelector<HTMLButtonElement>(
            `[data-accent="${accent}"]`,
        );
        current?.focus();
    }

    function closePalette(refocus = false) {
        if (palette.hidden) return;
        palette.hidden = true;
        paletteOwner?.setAttribute('aria-expanded', 'false');
        if (refocus) paletteOwner?.focus();
        paletteOwner = null;
    }

    palette.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            closePalette(true);
        }
    });
    document.addEventListener('pointerdown', (e) => {
        const t = e.target as Node;
        if (!palette.contains(t) && !paletteOwner?.contains(t)) closePalette();
    });
    addEventListener('resize', () => closePalette());
    addEventListener('scroll', () => closePalette(), { passive: true });

    // ── Accent toggles ────────────────────────────────────────────────────────

    for (const btn of accentToggles) {
        btn.setAttribute('aria-haspopup', 'true');
        btn.setAttribute('aria-expanded', 'false');

        // Long press. A press that opened the palette must not also count as
        // the click that follows it; the flag is reset on the next press rather
        // than on click because a touch long-press may fire no click at all.
        let holdTimer: number | undefined;
        let heldOpen = false;
        const cancelHold = () => {
            clearTimeout(holdTimer);
            holdTimer = undefined;
        };
        btn.addEventListener('pointerdown', (e) => {
            heldOpen = false;
            if (e.button !== 0 || accentSpinning) return;
            holdTimer = window.setTimeout(() => {
                holdTimer = undefined;
                heldOpen = true;
                openPalette(btn);
            }, HOLD_MS);
        });
        for (const ev of [
            'pointerup',
            'pointerleave',
            'pointercancel',
        ] as const) {
            btn.addEventListener(ev, cancelHold);
        }
        btn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            cancelHold();
            heldOpen = true;
            openPalette(btn);
        });

        btn.addEventListener('click', () => {
            if (heldOpen || accentSpinning) return;
            closePalette();

            const now = Date.now();
            accentClicks = accentClicks.filter((t) => now - t < 600);
            accentClicks.push(now);

            if (!REDUCE_MOTION && accentClicks.length >= 3) {
                accentClicks = [];
                spinAccent(btn);
                return;
            }

            cycleAccent(btn, 1);
        });

        // Arrow keys step through the accents while the toggle has focus.
        btn.addEventListener('keydown', (e) => {
            if (accentSpinning) return;
            const delta =
                e.key === 'ArrowRight' || e.key === 'ArrowDown'
                    ? 1
                    : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
                      ? -1
                      : 0;
            if (!delta) return;
            e.preventDefault();
            cycleAccent(btn, delta);
        });
    }

    // ── Theme ─────────────────────────────────────────────────────────────────

    for (const btn of themeToggles) {
        btn.addEventListener('click', () => {
            closePalette();
            const next: Theme = theme === 'dark' ? 'light' : 'dark';
            wipeFrom(btn, () => setTheme(next));
        });
    }
    for (const btn of themeChoices) {
        btn.addEventListener('click', () => {
            closePalette();
            const next = btn.dataset.themeChoice as Theme;
            if (next === theme) return;
            wipeFrom(btn, () => setTheme(next));
        });
    }

    // Re-apply the restored preferences without saving them: a visitor who
    // never picks a theme keeps following their OS.
    setTheme(theme, false);
    setAccent(accent, false);
}
