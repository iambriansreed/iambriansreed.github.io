/** The accent and theme controls, rendered into each page's own chrome rather
 * than floated over it: a compact icon pair for a header or a hero line, and
 * a labelled row of swatches plus a Dark / Light pair for a footer.
 *
 * appearance-client.ts drives every control it finds by class (call initAppearance()
 * from the page's client) and appearance.css styles them; a shell links that
 * stylesheet before its own. Any element with class `accent-toggle` cycles the
 * accent (the home page's hero dot is one), `theme-toggle` flips the theme,
 * `theme-choice` picks one, and `accent-swatch` picks an accent. */
import { ACCENTS } from './accents';

/** The brush that wiggles on hover and dabs on each change. */
export function BrushIcon() {
    return (
        <svg
            class="icon icon-brush"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
            <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1 1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
        </svg>
    );
}

/** One SVG that appearance.css morphs between a sun and a moon: the disc grows
 * and a masked "bite" slides in to carve the crescent while the rays shrink
 * away. `id` keeps the mask unique when a page shows the icon twice. */
export function ThemeIcon({ id }: { id: string }) {
    const mask = `theme-mask-${id}`;
    return (
        <svg
            class="icon icon-theme"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <mask id={mask}>
                <rect width="24" height="24" fill="#fff" />
                <circle class="theme-bite" cx="30" cy="-6" r="7" fill="#000" />
            </mask>
            <circle
                class="theme-disc"
                cx="12"
                cy="12"
                r="4.5"
                stroke="none"
                mask={`url(#${mask})`}
            />
            <path
                class="theme-rays"
                fill="none"
                d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            />
        </svg>
    );
}

/** The theme flip on its own, for a spot that only has room for one. */
export function ThemeButton({ id }: { id: string }) {
    return (
        <button
            class="appearance-btn theme-toggle"
            type="button"
            aria-label="Toggle color theme"
        >
            <ThemeIcon id={id} />
        </button>
    );
}

/** The icon pair for a header: brush, then sun or moon. */
export function AppearanceControls({ id }: { id: string }) {
    return (
        <div class="appearance">
            <button
                class="appearance-btn accent-toggle"
                type="button"
                aria-label="Cycle accent color"
            >
                <BrushIcon />
            </button>
            <ThemeButton id={id} />
        </div>
    );
}

/** The eight swatches. The footer row renders them here; the pop-over
 * appearance-client.ts opens from a toggle builds the same buttons itself. */
export function SwatchRow() {
    return (
        <div class="swatch-row" role="group" aria-label="Accent color">
            {ACCENTS.map((hex, i) => (
                <button
                    class="accent-swatch"
                    type="button"
                    data-accent={hex}
                    style={`--swatch: ${hex}; --i: ${i}`}
                    aria-label={`Accent ${i + 1} of ${ACCENTS.length}`}
                    aria-pressed="false"
                ></button>
            ))}
        </div>
    );
}

/** The footer's labelled row: swatches and a Dark / Light pair. */
export function AppearanceRow() {
    return (
        <div class="appearance-row">
            <span class="appearance-label">Appearance</span>
            <SwatchRow />
            <div class="theme-pair" role="group" aria-label="Theme">
                <button
                    class="theme-choice"
                    type="button"
                    data-theme-choice="dark"
                    aria-pressed="false"
                >
                    Dark
                </button>
                <span aria-hidden="true">·</span>
                <button
                    class="theme-choice"
                    type="button"
                    data-theme-choice="light"
                    aria-pressed="false"
                >
                    Light
                </button>
            </div>
        </div>
    );
}
