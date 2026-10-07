import data from '../data';
import content, { type Figure as ContentFigure } from './content';

// Absolute URLs for canonical, Open Graph and JSON-LD. The site is served from
// iambrian.com (public/CNAME), not from the dev origin. GitHub Pages redirects
// /bspk to /bspk/, so the slash form is the one that has to be canonical.
const SITE = 'https://iambrian.com';
const PAGE_PATH = '/bspk/';
const PAGE_URL = `${SITE}${PAGE_PATH}`;
// The docs site's hero, one file per theme. The page banner shows the one that
// matches data-theme; a share preview can only have one, so it gets the dark
// one, the site's default theme.
const BANNER: ThemedSrc = {
    light: '/bspk-figures/bspk-banner-light.png',
    dark: '/bspk-figures/bspk-banner-dark.png',
};
const BANNER_ALT =
    'The BSPK documentation site, showing a payment form, a team card, date pickers and tabs built from BSPK components.';
const OG_IMAGE = BANNER.dark;
const OG_IMAGE_ALT =
    'The BSPK documentation site in its dark theme, showing a payment form, a team card, date pickers and tabs built from BSPK components.';

// Inline markup the content file may use: `code` spans and [label](url) links.
// Splitting on a capturing group puts every match at an odd index.
const INLINE = /(`[^`]+`|\[[^\]]+\]\([^)\s]+\))/;
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

function Inline({ text }: { text: string }) {
    return (
        <>
            {text.split(INLINE).map((part, i) => {
                if (i % 2 === 0) return part;
                if (part.startsWith('`'))
                    return <code>{part.slice(1, -1)}</code>;
                const [, label, href] = LINK.exec(part)!;
                // Same convention as the rest of the site: anything that leaves
                // iambrian.com opens in a new tab, a mailto: link does not.
                return href.startsWith('http') ? (
                    <a href={href} target="_blank" rel="noopener noreferrer">
                        {label}
                    </a>
                ) : (
                    <a href={href}>{label}</a>
                );
            })}
        </>
    );
}

type ThemedSrc = { light: string; dark: string };

// One <img> per image, with no src: client.ts sets it from data-light or
// data-dark to match data-theme, and swaps it when the theme toggles. Rendering
// both variants and hiding one with CSS downloads both (Chrome fetches lazy
// images under display: none), and <picture media="(prefers-color-scheme)">
// follows the OS rather than the toggle. Without JS the noscript copy shows the
// dark variant, the default theme.
function ThemedImg({
    src,
    alt,
    width,
    height,
    priority,
}: {
    src: ThemedSrc;
    alt: string;
    width: number;
    height: number;
    priority?: boolean;
}) {
    const size = { width: String(width), height: String(height) };
    return (
        <>
            <img
                data-light={src.light}
                data-dark={src.dark}
                alt={alt}
                {...size}
                loading={priority ? undefined : 'lazy'}
                fetchpriority={priority ? 'high' : undefined}
                decoding="async"
            />
            <noscript>
                <img src={src.dark} alt={alt} {...size} />
            </noscript>
        </>
    );
}

// Each figure links to its image (client.ts keeps the href on the current
// theme's file) so the wide ones, the React and Angular comparison and the ten
// brands grid, open at full size.
function Figure({ figure }: { figure: ContentFigure }) {
    const { src, alt, caption, width, height } = figure;
    return (
        <figure>
            <a href={src.dark}>
                <ThemedImg src={src} alt={alt} width={width} height={height} />
            </a>
            <figcaption>{caption}</figcaption>
        </figure>
    );
}

// Everything a crawler or a link preview reads that is not in the body. The
// shell carries none of it on purpose, so this is the one place it lives.
function seoHead(): string {
    const { seo, title } = content;
    const image = `${SITE}${OG_IMAGE}`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: seo.description,
        url: PAGE_URL,
        mainEntityOfPage: PAGE_URL,
        image,
        author: {
            '@type': 'Person',
            name: data.name,
            url: SITE,
            sameAs: data.contactLinks
                .map((link) => link.href)
                .filter((href) => href.startsWith('https://')),
        },
        about: {
            '@type': 'SoftwareSourceCode',
            name: 'BSPK',
            codeRepository: 'https://github.com/iambriansreed/bspk-ui',
            license: 'https://creativecommons.org/licenses/by/4.0/',
        },
    };

    return String(
        <>
            <meta name="description" content={seo.description} />
            <meta
                name="robots"
                content="index, follow, max-image-preview:large"
            />
            <link rel="canonical" href={PAGE_URL} />
            <meta property="og:type" content="article" />
            <meta property="og:site_name" content={data.name} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={seo.description} />
            <meta property="og:url" content={PAGE_URL} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={OG_IMAGE_ALT} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={seo.description} />
            <meta name="twitter:image" content={image} />
            <script type="application/ld+json">
                {raw(JSON.stringify(jsonLd).replace(/</g, '\\u003c'))}
            </script>
        </>,
    );
}

export function Page(): Skrapa.Page {
    const { title, standfirst, facts, links, sections } = content;

    return {
        title: content.seo.title,
        head: seoHead(),
        body: (
            <>
                {/* The home page's floating toggles (markup copied from
                    src/index.tsx, behaviour in ./client.ts). */}
                <div class="fab-group">
                    <button
                        class="fa-btn accent-toggle"
                        aria-label="Cycle accent color"
                    >
                        <svg
                            class="icon"
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
                    </button>
                    <button
                        class="fa-btn theme-toggle"
                        aria-label="Toggle color theme"
                    >
                        <svg
                            class="icon icon-sun"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                        </svg>
                        <svg
                            class="icon icon-moon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    </button>
                </div>

                <header class="site-head">
                    <a class="site-brand" href="/">
                        <span class="site-brand-name">Brian • Reed</span>
                        <span class="site-brand-role">
                            Design Systems Engineer
                        </span>
                    </a>
                    <a class="btn btn-primary" href="/#contact">
                        Let's Talk
                    </a>
                </header>

                <main>
                    <article>
                        <div class="intro">
                            <a class="crumb" href="/#projects">
                                <span aria-hidden="true">←</span> Featured Works
                            </a>
                            <h1 class="title">{title}</h1>
                            <p class="standfirst">{standfirst}</p>
                            <div class="actions">
                                {links.map((link, i) => (
                                    <a
                                        class={`btn${i === 0 ? ' btn-primary' : ''}`}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <figure class="shot">
                            <ThemedImg
                                src={BANNER}
                                alt={BANNER_ALT}
                                width={1200}
                                height={630}
                                priority
                            />
                        </figure>

                        <ul class="facts">
                            {facts.map((fact) => (
                                <li>
                                    <strong>{fact.value}</strong>
                                    <span>{fact.label}</span>
                                </li>
                            ))}
                        </ul>

                        <div class="layout">
                            <nav class="toc" aria-label="On this page">
                                <span class="eyebrow">On this page</span>
                                <ol>
                                    {sections.map((section) => (
                                        <li>
                                            {/* Not a bare #id: skrapa puts
                                                <base href="/"> in the head, so
                                                that would resolve to the home
                                                page. */}
                                            <a
                                                href={`${PAGE_PATH}#${section.id}`}
                                            >
                                                {section.heading}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>

                            <div class="prose">
                                {sections.map((section) => (
                                    <section id={section.id}>
                                        <h2>{section.heading}</h2>
                                        {section.body.map((text) =>
                                            typeof text !== 'string' ? (
                                                <Figure figure={text} />
                                            ) : text.startsWith('> ') ? (
                                                <blockquote>
                                                    <p>
                                                        <Inline
                                                            text={text.slice(2)}
                                                        />
                                                    </p>
                                                </blockquote>
                                            ) : (
                                                <p>
                                                    <Inline text={text} />
                                                </p>
                                            ),
                                        )}
                                    </section>
                                ))}
                            </div>
                        </div>
                    </article>
                </main>

                <footer>
                    <div class="footer-brand">
                        <span class="footer-name">{data.name}</span>
                        <span class="footer-role">{data.subtitle}</span>
                    </div>
                    <div class="footer-links">
                        <a href="/">Home</a>
                        <a href="/resume">Resume</a>
                        <a href="/#contact">Connect</a>
                    </div>
                </footer>
                <script src="./client.ts"></script>
            </>
        ),
    };
}
