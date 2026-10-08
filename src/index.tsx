import data, { type Project, type ExperienceItem } from './data';
import { getApiOriginScript } from './utils';

const githubIcon = raw(
    `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true"><path fill="currentColor" d="M316.8 72C178.1 72 72 177.3 72 316C72 426.9 141.8 521.8 241.5 555.2C254.3 557.5 258.8 549.6 258.8 543.1C258.8 536.9 258.5 502.7 258.5 481.7C258.5 481.7 188.5 496.7 173.8 451.9C173.8 451.9 162.4 422.8 146 415.3C146 415.3 123.1 399.6 147.6 399.9C147.6 399.9 172.5 401.9 186.2 425.7C208.1 464.3 244.8 453.2 259.1 446.6C261.4 430.6 267.9 419.5 275.1 412.9C219.2 406.7 162.8 398.6 162.8 302.4C162.8 274.9 170.4 261.1 186.4 243.5C183.8 237 175.3 210.2 189 175.6C209.9 169.1 258 202.6 258 202.6C278 197 299.5 194.1 320.8 194.1C342.1 194.1 363.6 197 383.6 202.6C383.6 202.6 431.7 169 452.6 175.6C466.3 210.3 457.8 237 455.2 243.5C471.2 261.2 481 275 481 302.4C481 398.9 422.1 406.6 366.2 412.9C375.4 420.8 383.2 435.8 383.2 459.3C383.2 493 382.9 534.7 382.9 542.9C382.9 549.4 387.5 557.3 400.2 555C500.2 521.8 568 426.9 568 316C568 177.3 455.5 72 316.8 72z"/></svg>`,
);

const sendIcon = raw(
    `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true"><path fill="currentColor" d="M322.5 351.7L523.4 150.9L391 520.3L322.5 351.7zM489.4 117L288.6 317.8L120 249.3L489.4 117zM70.1 280.8L275.9 364.4L359.5 570.2C364.8 583.3 377.6 591.9 391.8 591.9C406.5 591.9 419.6 582.7 424.6 568.8L602.6 72C606.1 62.2 603.6 51.4 596.3 44C589 36.6 578.1 34.2 568.3 37.7L71.4 215.7C57.5 220.7 48.3 233.8 48.3 248.5C48.3 262.7 56.9 275.5 70 280.8z"/></svg>`,
);

const arrowIcon = raw(
    `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>`,
);

const npmIcon = raw(
    `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M2 2h20v20H2V2zm3 3v14h4V9h6v10h4V5H5z"/></svg>`,
);

function cx(...classes: unknown[]): string {
    return classes.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}

// Pick a source-link icon by host: GitHub, npm, or a generic external-link arrow.
function sourceIcon(url: string): { svg: JSX.Element; class: string } | null {
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

const LINKEDIN_URL = 'https://www.linkedin.com/in/iambriansreed/';
const GITHUB_URL = 'https://github.com/iambriansreed';

/**
 * A field no person can see, reach by tab, or have autofilled — so anything that
 * arrives with it set was filling every input it could find. The API drops those
 * submissions (see submission-guard.ts) and answers as if they had worked.
 *
 * Deliberately a real text input parked off-screen by `.hp` rather than
 * `type="hidden"` or `display:none`, both of which the better crawlers skip.
 */
function Honeypot({ id }: { id: string }) {
    return (
        <div class="hp" aria-hidden="true">
            <label for={id}>Website</label>
            <input
                type="text"
                id={id}
                name="website"
                tabindex="-1"
                autocomplete="off"
            />
        </div>
    );
}

const expItems = data.experience.filter((item) => !item.volunteer);

const NAV_LINKS = [
    { href: '#work', label: 'Work' },
    { href: '#experience', label: 'Experience' },
    { href: '#contact', label: 'Contact' },
];

/** The site's shared top bar; client.ts reveals it once the hero scrolls past. */
function SiteHeader({ title }: { title: string }) {
    return (
        <header>
            <a class="nav-brand" href="#top">
                <span class="nav-brand-name">Brian • Reed</span>
                <span class="nav-brand-role">{title}</span>
            </a>
            <nav class="nav-links" aria-label="Sections">
                {NAV_LINKS.map((l) => (
                    <a href={l.href}>{l.label}</a>
                ))}
            </nav>
            <a class="btn btn-primary nav-cta" href="#contact">
                Let's Talk
            </a>
        </header>
    );
}

/** Accent and theme toggles; client.ts finds them by class. */
function Fabs() {
    return (
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
            <button class="fa-btn theme-toggle" aria-label="Toggle color theme">
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
    );
}

/** A Featured Works card, identical to the live page's. */
function ProjectCard({ project, i }: { project: Project; i: number }) {
    return (
        <article
            class={cx(`project-item`, project.wide && 'is-wide')}
            data-category={project.category}
        >
            <a
                class="project-thumb"
                href={project.url}
                target={!project.internal ? '_blank' : undefined}
                rel={!project.internal ? 'noopener noreferrer' : undefined}
                style={`--shift:${i * 55}`}
                aria-hidden="true"
                tabindex="-1"
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
                    <span class="project-thumb-mark">
                        {project.title.charAt(0)}
                    </span>
                )}
            </a>
            <div class="project-body">
                <span class="project-cat">{project.category}</span>
                <a
                    href={project.url}
                    class="project-title"
                    target={!project.internal ? '_blank' : undefined}
                    rel={!project.internal ? 'noopener noreferrer' : undefined}
                >
                    {project.title} {arrowIcon}
                </a>
                <p class="project-desc">{project.description}</p>
                <div class="tags">
                    {project.skills.map((s) => (
                        <span class="tag">{s}</span>
                    ))}
                </div>
                {project.sources.length > 0 && (
                    <div class="project-sources">
                        {project.sources.map((source) => {
                            const icon = sourceIcon(source.url);
                            return (
                                <a
                                    href={source.url}
                                    class={cx('source-link', icon?.class)}
                                    target={
                                        !source.internal ? '_blank' : undefined
                                    }
                                    rel={
                                        !source.internal
                                            ? 'noopener noreferrer'
                                            : undefined
                                    }
                                >
                                    {icon?.svg}
                                    {source.title} {arrowIcon}
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        </article>
    );
}

/** One experience card; the résumé bullets where there are any. */
function ExperienceCard({ item }: { item: ExperienceItem }) {
    const bullets = (item.bullets ?? item.description).slice(0, 3);
    return (
        <article class="exp-item">
            <div class="exp-meta">
                <div class="exp-meta-col">
                    <span class="exp-label">Duration</span>
                    <span class="exp-value">
                        {formatDate(item.startedOn)} –{' '}
                        {item.finishedOn
                            ? formatDate(item.finishedOn)
                            : 'Present'}
                    </span>
                </div>
                <div class="exp-meta-col">
                    <span class="exp-label">Location</span>
                    <span class="exp-value">{item.location}</span>
                </div>
            </div>
            <h3 class="exp-role">{item.title}</h3>
            <p class="exp-company">{item.companyName}</p>
            <ul class="exp-bullets">
                {bullets.map((d) => (
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
    );
}

/** Get In Touch: LinkedIn and GitHub, the message form, and the recruiter
 * quiz as a text link under them rather than a third equal option. */
function ContactSection() {
    return (
        <section id="contact" class="connect">
            <div class="section-head">
                <span class="eyebrow">Available for work</span>
                <h2 class="section-title">Get In Touch</h2>
            </div>
            <div class="connect-grid">
                <ul class="connect-list">
                    <li class="connect-item">
                        <span class="connect-num">01</span>
                        <a
                            href={LINKEDIN_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span class="connect-label">LinkedIn</span>
                            <span class="connect-action">
                                /in/iambriansreed {arrowIcon}
                            </span>
                        </a>
                    </li>
                    <li class="connect-item">
                        <span class="connect-num">02</span>
                        <a
                            href={GITHUB_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span class="connect-label">GitHub</span>
                            <span class="connect-action">
                                @iambriansreed {arrowIcon}
                            </span>
                        </a>
                    </li>
                </ul>
                <form
                    id="msg-form"
                    class="msg-card"
                    aria-label="Send a message"
                >
                    <label for="msg-textarea" class="sr-only">
                        Your message (include your email so I can reply)
                    </label>
                    <textarea
                        class="msg-textarea"
                        id="msg-textarea"
                        placeholder="Write your message; drop your email in anywhere so I can reply."
                        aria-describedby="msg-hint"
                    />
                    <div class="msg-actions">
                        <p class="msg-hint" id="msg-hint" aria-live="polite">
                            Include your email anywhere in your message.
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
                    <Honeypot id="hp-contact" />
                </form>
            </div>
            <p class="connect-meta">
                Based remotely · available worldwide. Recruiters: the{' '}
                <button type="button" class="link-btn" data-open-quiz>
                    two-minute fit check
                </button>{' '}
                saves us both a call.
            </p>
        </section>
    );
}

const DEFAULT_FOOTER_LINKS = [
    { href: '#about', label: 'About' },
    { href: '#work', label: 'Work' },
    { href: '#experience', label: 'Experience' },
    { href: '#contact', label: 'Contact' },
];

function SiteFooter({
    links = DEFAULT_FOOTER_LINKS,
}: {
    links?: { href: string; label: string }[];
}) {
    return (
        <footer>
            <div class="footer-brand">
                <span class="footer-name">Brian S. Reed</span>
                <span class="footer-role">
                    Design Systems Engineer · Front-End Architect
                </span>
            </div>
            <div class="footer-links">
                {links.map((l) => (
                    <a href={l.href}>{l.label}</a>
                ))}
            </div>
        </footer>
    );
}

/** The recruiter quiz dialog. Opened by any `data-open-quiz` button, or by
 * linking to `/#quiz` (see client.ts). */
function Quiz() {
    const { questions } = data;
    return (
        <dialog
            id="recruiter-quiz"
            class="quiz-modal"
            data-state="quiz"
            aria-labelledby="quiz-title"
        >
            <div class="quiz-head">
                <div>
                    <span class="eyebrow">Recruiters</span>
                    <h3 id="quiz-title" class="quiz-title">
                        A quick fit check
                    </h3>
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
                If you think I might be a good fit, answer a few quick questions
                first so we both know early whether a call is worth it. No
                exact match? Pick the closest and we'll talk it through.
            </p>

            <form class="quiz" novalidate>
                {questions.map((question) => {
                    const failText = question.answers.find(
                        (a) => a.failReason,
                    )?.failReason;

                    // Compensation: a stylized salary input + a "not
                    // available" poison option. Both carry the question id
                    // as their name: client.ts builds the submission from
                    // FormData, which skips nameless controls.
                    if (question.id === 'compensation') {
                        return (
                            <fieldset
                                class="quiz-question"
                                data-id={question.id}
                                data-title={question.title}
                                data-type="amount"
                            >
                                <legend>{question.title}</legend>
                                <div class="quiz-amount">
                                    <span class="quiz-amount-prefix">$</span>
                                    <label
                                        for="quiz-amount-input"
                                        class="sr-only"
                                    >
                                        Annual base compensation
                                    </label>
                                    <input
                                        type="number"
                                        id="quiz-amount-input"
                                        class="quiz-amount-input"
                                        name={question.id}
                                        min="0"
                                        step="1000"
                                        inputmode="numeric"
                                    />
                                    <span class="quiz-amount-suffix">
                                        / year
                                    </span>
                                </div>
                                <label class="quiz-na">
                                    <input
                                        type="checkbox"
                                        name={question.id}
                                        value="fail"
                                    />
                                    Not available / not disclosed
                                </label>
                                <p class="quiz-fail-reason">{failText}</p>
                            </fieldset>
                        );
                    }

                    // Expertise: multi-select pills, one per answer, none of
                    // them disqualifying.
                    if (question.id === 'expertise') {
                        return (
                            <fieldset
                                class="quiz-question"
                                data-id={question.id}
                                data-title={question.title}
                                data-type="multi"
                            >
                                <legend>{question.title}</legend>
                                <div class="quiz-pills">
                                    {question.answers.map((answer) => (
                                        <label class="quiz-pill">
                                            <input
                                                type="checkbox"
                                                name={question.id}
                                                value={answer.title}
                                            />
                                            {answer.title}
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                        );
                    }

                    return (
                        <fieldset
                            class="quiz-question"
                            data-id={question.id}
                            data-title={question.title}
                        >
                            <legend>{question.title}</legend>
                            <div class="quiz-options">
                                {question.answers.map((answer, index) => {
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
                                                    name={question.id}
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
                                                    {answer.failReason}
                                                </p>
                                            )}
                                        </>
                                    );
                                })}
                            </div>
                        </fieldset>
                    );
                })}
                <footer class="quiz-foot">
                    <p class="quiz-error" role="alert">
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
                    Thanks for taking the time. Based on your answers (see the{' '}
                    <span class="quiz-fail-ref">notes under them</span>), this
                    one likely isn't a match.
                </p>
                <p>
                    Think it's a mistake? Adjust the highlighted answers, or
                    reach out on{' '}
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
                    Add your email and I'll be in touch; your quiz answers are
                    sent along too.
                </p>
                <div class="quiz-email">
                    <label for="quiz-email" class="sr-only">
                        Your email
                    </label>
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
                <p class="quiz-error">That email address doesn't look right.</p>
                {/* In this form and not the questions form above:
                    that one is serialised wholesale into the quiz
                    answers, and this field is not an answer. */}
                <Honeypot id="hp-quiz" />
            </form>

            <div class="quiz-result quiz-sent">
                <h3>Sent; thank you!</h3>
                <p>
                    I'll review your answers and get back to you soon. In the
                    meantime, find me on{' '}
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
    );
}

/** The API origin and the page's client bundle. */
function Scripts() {
    return (
        <>
            <script>{getApiOriginScript()}</script>
            <script src="./client.ts"></script>
        </>
    );
}

const FOOTER_LINKS = [
    { href: '#work', label: 'Work' },
    { href: '#experience', label: 'Experience' },
    { href: '#contact', label: 'Contact' },
];

export function Page(): Skrapa.Page {
    const { summary, projects } = data;

    return {
        body: (
            <>
                <SiteHeader title="Design Systems Engineer" />

                <main>
                    <section id="top" class="hero">
                        <p class="hero-kicker">
                            Brian S
                            <span
                                class="hero-name-dot"
                                aria-hidden="true"
                            ></span>{' '}
                            Reed · Design Systems Engineer · Front-End Architect
                        </p>
                        <h1 class="hero-statement">
                            I build the system other teams build on
                            <span class="hero-dot" aria-hidden="true"></span>
                        </h1>
                        <p class="hero-lede">{summary}</p>
                        <p class="hero-links">
                            <a href="/bspk/">
                                BSPK, the case study {arrowIcon}
                            </a>
                            <a
                                href="/resume"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Résumé {arrowIcon}
                            </a>
                            <a
                                href={LINKEDIN_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                LinkedIn {arrowIcon}
                            </a>
                            <a
                                href={GITHUB_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                GitHub {arrowIcon}
                            </a>
                        </p>
                    </section>

                    <section id="work" class="projects">
                        <div class="section-head">
                            <span class="eyebrow">01 · Work</span>
                            <h2 class="section-title">Systems</h2>
                            <p class="section-lead">
                                A design system for ten brands, the tool that
                                builds this page, and a few things built on my
                                own time.
                            </p>
                        </div>
                        <div class="proj-grid">
                            {projects.map((project, i) => (
                                <ProjectCard project={project} i={i} />
                            ))}
                        </div>
                    </section>

                    <section id="experience">
                        <div class="section-head">
                            <span class="eyebrow">02 · Experience</span>
                            <h2 class="section-title">Work &amp; Impact</h2>
                        </div>
                        <div class="exp-grid">
                            {expItems.slice(0, 3).map((item) => (
                                <ExperienceCard item={item} />
                            ))}
                        </div>
                        <p class="exp-more">
                            <a
                                class="exp-more-link"
                                href="/resume"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Full history on the résumé {arrowIcon}
                            </a>
                        </p>
                    </section>

                    <ContactSection />
                </main>

                <Fabs />
                <SiteFooter links={FOOTER_LINKS} />
                <Quiz />
                <Scripts />
            </>
        ),
    };
}
