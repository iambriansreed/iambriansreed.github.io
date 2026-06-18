import data from './data';

const githubIcon = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true"><path fill="currentColor" d="M316.8 72C178.1 72 72 177.3 72 316C72 426.9 141.8 521.8 241.5 555.2C254.3 557.5 258.8 549.6 258.8 543.1C258.8 536.9 258.5 502.7 258.5 481.7C258.5 481.7 188.5 496.7 173.8 451.9C173.8 451.9 162.4 422.8 146 415.3C146 415.3 123.1 399.6 147.6 399.9C147.6 399.9 172.5 401.9 186.2 425.7C208.1 464.3 244.8 453.2 259.1 446.6C261.4 430.6 267.9 419.5 275.1 412.9C219.2 406.7 162.8 398.6 162.8 302.4C162.8 274.9 170.4 261.1 186.4 243.5C183.8 237 175.3 210.2 189 175.6C209.9 169.1 258 202.6 258 202.6C278 197 299.5 194.1 320.8 194.1C342.1 194.1 363.6 197 383.6 202.6C383.6 202.6 431.7 169 452.6 175.6C466.3 210.3 457.8 237 455.2 243.5C471.2 261.2 481 275 481 302.4C481 398.9 422.1 406.6 366.2 412.9C375.4 420.8 383.2 435.8 383.2 459.3C383.2 493 382.9 534.7 382.9 542.9C382.9 549.4 387.5 557.3 400.2 555C500.2 521.8 568 426.9 568 316C568 177.3 455.5 72 316.8 72z"/></svg>`;

const linkedinIcon = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"/></svg>`;

const sendIcon = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true"><path fill="currentColor" d="M322.5 351.7L523.4 150.9L391 520.3L322.5 351.7zM489.4 117L288.6 317.8L120 249.3L489.4 117zM70.1 280.8L275.9 364.4L359.5 570.2C364.8 583.3 377.6 591.9 391.8 591.9C406.5 591.9 419.6 582.7 424.6 568.8L602.6 72C606.1 62.2 603.6 51.4 596.3 44C589 36.6 578.1 34.2 568.3 37.7L71.4 215.7C57.5 220.7 48.3 233.8 48.3 248.5C48.3 262.7 56.9 275.5 70 280.8z"/></svg>`;

const arrowIcon = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>`;

const npmIcon = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M2 2h20v20H2V2zm3 3v14h4V9h6v10h4V5H5z"/></svg>`;

// Pick a source-link icon by host: GitHub, npm, or a generic external-link arrow.
function sourceIcon(url: string): { svg: string; class: string } | null {
    if (url.includes('github.com')) return { svg: githubIcon, class: 'github' };
    if (url.includes('npmjs.com')) return { svg: npmIcon, class: 'npm' };
    return null;
}

function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
    });
}

const COOKIE_STATES = [
    { accepted: false, label: 'Accept' },
    { accepted: true, label: 'Decline' },
];

// Curated tech stack drawn from the skills evidenced across roles + projects.
const TECH_STACK = [
    'React',
    'TypeScript',
    'Accessibility',
    'SASS',
    'Design Systems',
    'Component Libraries',
    'Node.js',
    'Figma',
    'Angular',
    'Tailwind',
    'CI/CD',
    'Vite',
    'Socket.io',
    'React Native',
    'PHP',
    'C#',
    'SharePoint',
];

const NAV_LINKS = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Connect', href: '#contact' },
];

const RESUME_URL = 'https://resume.iambrian.com';
const LINKEDIN_URL = 'https://www.linkedin.com/in/iambriansreed/';
const GITHUB_URL = 'https://github.com/iambriansreed';

export function Page(): Page {
    const { introduction, experience, projects, questions } = data;
    const expItems = experience.filter((item) => !item.volunteer);

    return {
        head: <link rel="stylesheet" href="/home.css" />,
        body: (
            <>
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

                <nav class="site-nav">
                    <a class="nav-brand" href="#top">
                        <span class="nav-brand-name">Brian • Reed</span>
                        <span class="nav-brand-role">Front-End Architect</span>
                    </a>
                    <div class="nav-links">
                        {NAV_LINKS.map((link) => (
                            <a class="nav-link" href={link.href}>
                                {link.label}
                            </a>
                        ))}
                        <a class="btn btn-primary nav-cta" href="#contact">
                            Let's Talk
                        </a>
                    </div>
                    <button
                        class="nav-toggle"
                        popovertarget="mobile-menu"
                        aria-label="Open navigation"
                    >
                        <span></span>
                        <span></span>
                    </button>
                </nav>

                <dialog id="mobile-menu" popover="auto" class="mobile-menu">
                    <button
                        type="button"
                        class="icon-btn mobile-menu-close"
                        popovertarget="mobile-menu"
                        popovertargetaction="hide"
                        aria-label="Close navigation"
                    >
                        <svg
                            class="icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                    {NAV_LINKS.map((link) => (
                        <a class="nav-link" href={link.href}>
                            {link.label}
                        </a>
                    ))}
                    <a class="btn btn-primary nav-cta" href="#contact">
                        Let's Talk
                    </a>
                </dialog>

                <main>
                    <section id="top" class="hero">
                        <span class="hero-badge">
                            <span class="hero-badge-dot"></span>
                            Available for work
                        </span>
                        <div class="hero-grid">
                            <div class="hero-main">
                                <h1
                                    class="hero-name"
                                    aria-label="Brian S. Reed"
                                >
                                    Brian S
                                    <span
                                        class="hero-name-dot"
                                        aria-hidden="true"
                                    ></span>{' '}
                                    Reed
                                </h1>
                                <div class="hero-role-row">
                                    <p class="hero-role">
                                        <span class="hero-rule"></span>
                                        <span class="hero-role-titles">
                                            <span>Front-End Architect</span>
                                            <span class="hero-role-sep">·</span>
                                            <span>Staff Engineer</span>
                                        </span>
                                    </p>
                                    <p class="hero-tagline">
                                        Fifteen years turning complex product
                                        requirements into fast, accessible,
                                        beautifully engineered interfaces.
                                    </p>
                                </div>
                                <div class="hero-actions">
                                    <a class="btn btn-primary" href="#contact">
                                        Collaborate
                                    </a>
                                    <a
                                        class="btn"
                                        href={RESUME_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Resume
                                    </a>
                                </div>
                            </div>
                            <div class="hero-rail">
                                <a
                                    href={LINKEDIN_URL}
                                    aria-label="LinkedIn"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {linkedinIcon}
                                </a>
                                <a
                                    href={GITHUB_URL}
                                    aria-label="GitHub"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {githubIcon}
                                </a>
                                <a href="#contact" aria-label="Message me">
                                    {sendIcon}
                                </a>
                            </div>
                        </div>
                    </section>

                    <section id="about" class="about">
                        <div class="about-grid">
                            <div class="about-main">
                                <div class="section-head">
                                    <span class="eyebrow">Biography</span>
                                    <h2 class="section-title">What I Do</h2>
                                </div>
                                <p class="about-statement">
                                    Building scalable UI systems with a focus on
                                    accessibility, performance, and developer
                                    experience.
                                </p>
                                <p class="about-body">{introduction}</p>
                                <div class="about-card">
                                    <div class="about-row">
                                        <span class="about-label">
                                            Location
                                        </span>
                                        <span class="about-value">Remote</span>
                                    </div>
                                    <div class="about-row">
                                        <span class="about-label">Status</span>
                                        <span class="about-value">
                                            Open to senior front-end roles
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="hero-photo about-photo">
                                <img
                                    src="/me.jpg"
                                    alt="Brian S. Reed"
                                    width="480"
                                    height="480"
                                />
                            </div>
                        </div>
                    </section>

                    <section id="skills" class="skills">
                        <div class="section-head">
                            <span class="eyebrow">Inventory</span>
                            <h2 class="section-title">Tech Stack</h2>
                        </div>
                        <div class="skills-chips">
                            {TECH_STACK.map((s) => (
                                <span class="btn skill-chip">{s}</span>
                            ))}
                        </div>
                    </section>

                    <section id="projects" class="projects">
                        <div class="section-head">
                            <span class="eyebrow">Portfolio</span>
                            <h2 class="section-title">Featured Works</h2>
                            <p class="section-lead">
                                Small, focused web apps; built front to back
                                with TypeScript.
                            </p>
                        </div>
                        <div class="proj-grid">
                            {projects.map((project, i) => (
                                <article
                                    class="project-item u-skew"
                                    data-category={project.category}
                                >
                                    <a
                                        class="project-thumb"
                                        href={project.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={`--shift:${i * 55}`}
                                        aria-hidden="true"
                                    >
                                        {project.thumbnail ? (
                                            <img
                                                src={`/${project.thumbnail}`}
                                                alt=""
                                                loading="lazy"
                                                decoding="async"
                                                width="480"
                                                height="300"
                                            />
                                        ) : (
                                            <span class="project-thumb-mark u-unskew">
                                                {project.title.charAt(0)}
                                            </span>
                                        )}
                                    </a>
                                    <div class="project-body u-unskew">
                                        <span class="project-cat">
                                            {project.category}
                                        </span>
                                        <a
                                            href={project.url}
                                            class="project-title"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {project.title} {arrowIcon}
                                        </a>
                                        <p class="project-desc">
                                            {project.description}
                                        </p>
                                        <div class="tags">
                                            {project.skills.map((s) => (
                                                <span class="tag">{s}</span>
                                            ))}
                                        </div>
                                        {project.sources.length > 0 && (
                                            <div class="project-sources">
                                                {project.sources.map(
                                                    (source) => {
                                                        const icon = sourceIcon(
                                                            source.url,
                                                        );
                                                        return (
                                                            <a
                                                                href={
                                                                    source.url
                                                                }
                                                                class={`source-link ${icon?.class}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                {icon?.svg}
                                                                {
                                                                    source.title
                                                                }{' '}
                                                                {arrowIcon}
                                                            </a>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section id="experience">
                        <div class="exp-sticky">
                            <div class="section-head">
                                <span class="eyebrow">Experience</span>
                                <h2 class="section-title">Work &amp; Impact</h2>
                            </div>
                            <div class="exp-track">
                                {expItems.map((item) => (
                                    <article class="exp-item">
                                        <div class="exp-meta">
                                            <div class="exp-meta-col">
                                                <span class="exp-label">
                                                    Duration
                                                </span>
                                                <span class="exp-value">
                                                    {formatDate(item.startedOn)}{' '}
                                                    –{' '}
                                                    {item.finishedOn
                                                        ? formatDate(
                                                              item.finishedOn,
                                                          )
                                                        : 'Present'}
                                                </span>
                                            </div>
                                            <div class="exp-meta-col">
                                                <span class="exp-label">
                                                    Location
                                                </span>
                                                <span class="exp-value">
                                                    {item.location}
                                                </span>
                                            </div>
                                        </div>
                                        <h3 class="exp-role">{item.title}</h3>
                                        <p class="exp-company">
                                            {item.companyName}
                                        </p>
                                        <ul class="exp-bullets">
                                            {item.description.map((d) => (
                                                <li>{d}</li>
                                            ))}
                                        </ul>
                                        <div class="exp-tools">
                                            <div class="tags">
                                                {item.skills.map((s) => (
                                                    <span class="tag">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                            <div class="exp-timeline">
                                {expItems.map((item, i) => (
                                    <button
                                        type="button"
                                        class="exp-dot"
                                        data-index={String(i)}
                                        aria-label={`Jump to ${item.title}`}
                                    >
                                        <span class="exp-dot-mark"></span>
                                        <span class="exp-dot-year">
                                            {item.finishedOn
                                                ? new Date(
                                                      item.startedOn,
                                                  ).getFullYear()
                                                : 'Present'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="contact" class="connect">
                        <div class="section-head">
                            <span class="eyebrow">Available for work</span>
                            <h2 class="section-title">Get In Touch</h2>
                        </div>
                        <div class="connect-grid">
                            <ul class="connect-list u-skew">
                                <li class="connect-item">
                                    <span class="connect-num">01</span>
                                    <button type="button" data-open-quiz>
                                        <span class="connect-label">
                                            Recruiters
                                        </span>
                                        <span class="connect-action">
                                            Take the quiz {arrowIcon}
                                        </span>
                                    </button>
                                </li>
                                <li class="connect-item">
                                    <span class="connect-num">02</span>
                                    <a
                                        href={LINKEDIN_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span class="connect-label">
                                            LinkedIn
                                        </span>
                                        <span class="connect-action">
                                            /in/iambriansreed {arrowIcon}
                                        </span>
                                    </a>
                                </li>
                                <li class="connect-item">
                                    <span class="connect-num">03</span>
                                    <a
                                        href={GITHUB_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span class="connect-label">
                                            GitHub
                                        </span>
                                        <span class="connect-action">
                                            @iambriansreed {arrowIcon}
                                        </span>
                                    </a>
                                </li>
                            </ul>
                            <form
                                id="msg-form"
                                class="msg-card u-skew"
                                aria-label="Send a message"
                            >
                                <textarea
                                    class="msg-textarea"
                                    id="msg-textarea"
                                    placeholder="Write your message; drop your email in anywhere so I can reply."
                                />
                                <div class="msg-actions">
                                    <p class="msg-hint" id="msg-hint">
                                        Include your email anywhere in your
                                        message.
                                    </p>
                                    <button
                                        class="btn msg-send"
                                        id="msg-send"
                                        type="submit"
                                        value="send"
                                    >
                                        {sendIcon}Send
                                    </button>
                                </div>
                                <div class="msg-success" id="msg-success">
                                    <p>Thanks! I'll get back to you soon.</p>
                                </div>
                            </form>
                        </div>
                        <p class="connect-meta">
                            Based remotely · available worldwide.
                        </p>
                    </section>

                    <aside class="quote-band">
                        <blockquote class="quote-band-inner">
                            <p class="quote-band-text">
                                Everything is designed
                                <span
                                    class="quote-band-dot"
                                    aria-hidden="true"
                                ></span>{' '}
                                Few things are designed well
                                <span
                                    class="quote-band-dot"
                                    aria-hidden="true"
                                ></span>
                            </p>
                            <cite class="quote-band-cite">— me</cite>
                        </blockquote>
                    </aside>
                </main>

                <footer>
                    <div class="footer-brand">
                        <span class="footer-name">Brian S. Reed</span>
                        <span class="footer-role">
                            Front-End Architect · Staff Engineer
                        </span>
                    </div>
                    <div class="footer-links">
                        <a href="#about">About</a>
                        <a href="#experience">Work</a>
                        <a href="#contact">Connect</a>
                    </div>
                    <div class="footer-end">
                        <button
                            class="cookie-settings"
                            popovertarget="cookie-bar"
                            aria-label="Cookies"
                        >
                            Cookies
                        </button>
                    </div>
                </footer>

                <dialog id="cookie-policy" popover="auto">
                    <h3>Cookie Policy</h3>
                    <p>
                        This site stores your preferences; color theme, accent
                        color, and cookie consent; in your browser's local
                        storage. No personal data is collected or sent anywhere.
                    </p>
                    <p>
                        Nothing is shared with third parties, used for ads, or
                        tracked across sessions.
                    </p>
                    <p>
                        You can clear your preferences at any time through your
                        browser settings or by toggling the button in the cookie
                        bar.
                    </p>
                </dialog>
                <dialog id="cookie-bar" popover="manual">
                    <span class="label">Cookies</span>
                    {COOKIE_STATES.map(({ label, accepted }) => (
                        <button
                            data-cookie={accepted}
                            class={`btn btn-primary btn-sm consent-btn ${label.toLowerCase()}`}
                            aria-label={`${label} cookies`}
                        >
                            {label}
                        </button>
                    ))}
                    <button
                        popovertarget="cookie-policy"
                        class="icon-btn policy-btn"
                        aria-label="Show Cookie Policy Popover"
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
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4M12 8h.01" />
                        </svg>
                        Policy
                    </button>
                    <button
                        type="button"
                        class="icon-btn cookie-close"
                        popovertarget="cookie-bar"
                        popovertargetaction="hide"
                        aria-label="Dismiss cookie bar"
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
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </dialog>

                <dialog
                    id="recruiter-quiz"
                    class="quiz-modal"
                    data-state="quiz"
                >
                    <div class="quiz-head">
                        <div>
                            <span class="eyebrow">Recruiters</span>
                            <h3 class="quiz-title">A quick fit check</h3>
                        </div>
                        <button
                            type="button"
                            class="icon-btn quiz-close"
                            aria-label="Close"
                            data-close-quiz
                        >
                            <svg
                                class="icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <p class="quiz-intro">
                        If you think I might be a good fit, answer a few quick
                        questions first so we don't waste each other's time. No
                        exact match? Pick the closest and we'll talk it through.
                    </p>

                    <form class="quiz" novalidate>
                        {questions.map((question) => {
                            const failText = question.answers.find(
                                (a) => a.failReason,
                            )?.failReason;

                            // Compensation: a stylized salary input + a "not
                            // available" poison option.
                            if (question.id === 'compensation') {
                                return (
                                    <fieldset
                                        class="quiz-question"
                                        data-id={question.id}
                                        data-title={question.title}
                                        data-type="amount"
                                    >
                                        <h4>{question.title}</h4>
                                        <div class="quiz-amount">
                                            <span class="quiz-amount-prefix">
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                class="quiz-amount-input"
                                                min="0"
                                                step="1000"
                                                inputmode="numeric"
                                                placeholder="180,000"
                                            />
                                            <span class="quiz-amount-suffix">
                                                / year
                                            </span>
                                        </div>
                                        <label class="quiz-na">
                                            <input
                                                type="checkbox"
                                                value="fail"
                                            />
                                            Not available / not disclosed
                                        </label>
                                        <p class="quiz-fail-reason">
                                            {failText}
                                        </p>
                                    </fieldset>
                                );
                            }

                            // Expertise: multi-select pills, with Java and Python
                            // each a separate poison.
                            if (question.id === 'expertise') {
                                const skills = [
                                    'Java',
                                    'Python',
                                    'React',
                                    'React Native',
                                    'Angular',
                                    'Other',
                                ];
                                return (
                                    <fieldset
                                        class="quiz-question"
                                        data-id={question.id}
                                        data-title={question.title}
                                        data-type="multi"
                                    >
                                        <h4>{question.title}</h4>
                                        <div class="quiz-pills">
                                            {skills.map((skill) => {
                                                const poison =
                                                    skill === 'Java' ||
                                                    skill === 'Python';
                                                return (
                                                    <label class="quiz-pill">
                                                        <input
                                                            type="checkbox"
                                                            value={
                                                                poison
                                                                    ? 'fail'
                                                                    : skill
                                                            }
                                                        />
                                                        {skill}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        <p class="quiz-fail-reason">
                                            {failText}
                                        </p>
                                    </fieldset>
                                );
                            }

                            return (
                                <fieldset
                                    class="quiz-question"
                                    data-id={question.id}
                                    data-title={question.title}
                                >
                                    <h4>{question.title}</h4>
                                    <div class="quiz-options">
                                        {question.answers.map(
                                            (answer, index) => {
                                                const labelId =
                                                    question.id +
                                                    (answer.failReason
                                                        ? '-fail'
                                                        : '-' + index);
                                                return (
                                                    <>
                                                        <label for={labelId}>
                                                            <input
                                                                type="radio"
                                                                name={
                                                                    question.id
                                                                }
                                                                value={
                                                                    answer.failReason
                                                                        ? 'fail'
                                                                        : answer.title
                                                                }
                                                                id={labelId}
                                                                required
                                                            />
                                                            {answer.title}
                                                        </label>
                                                        {answer.failReason && (
                                                            <p class="quiz-fail-reason">
                                                                {
                                                                    answer.failReason
                                                                }
                                                            </p>
                                                        )}
                                                    </>
                                                );
                                            },
                                        )}
                                    </div>
                                </fieldset>
                            );
                        })}
                        <footer class="quiz-foot">
                            <p class="quiz-error">
                                Please answer every question.
                            </p>
                            <button type="submit" class="btn btn-primary">
                                Check results
                            </button>
                        </footer>
                    </form>

                    <div class="quiz-result quiz-fail">
                        <h3>Probably not a fit.</h3>
                        <p>
                            Thanks for taking the time. Based on your answers
                            (see the notes in red above), this one likely isn't
                            a match.
                        </p>
                        <p>
                            Think it's a mistake? Adjust the highlighted
                            answers, or reach out on{' '}
                            <a
                                href={LINKEDIN_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                LinkedIn
                            </a>
                            .
                        </p>
                    </div>

                    <form class="quiz-result quiz-pass" novalidate>
                        <h3>This could be a great fit!</h3>
                        <p>
                            Add your email and I'll be in touch; your quiz
                            answers are sent along too.
                        </p>
                        <div class="quiz-email">
                            <input
                                type="email"
                                id="quiz-email"
                                placeholder="you@company.com"
                                autocomplete="email"
                                required
                            />
                            <button type="submit" class="btn btn-primary">
                                Send results
                            </button>
                        </div>
                        <p class="quiz-error">
                            That email address doesn't look right.
                        </p>
                    </form>

                    <div class="quiz-result quiz-sent">
                        <h3>Sent; thank you!</h3>
                        <p>
                            I'll review your answers and get back to you soon.
                            In the meantime, find me on{' '}
                            <a
                                href={LINKEDIN_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                LinkedIn
                            </a>
                            .
                        </p>
                    </div>
                </dialog>
            </>
        ),
    };
}
