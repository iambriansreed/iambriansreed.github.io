import data from '../data';
import type { SkillItem, ExperienceItem } from '../data';

// "(N yrs)" / "(note)" suffix rendered in muted text after a skill name.
function skillAside(skill: SkillItem): string | null {
    if (skill.years) return `(${skill.years} yrs)`;
    if (skill.note) return `(${skill.note})`;
    return null;
}

function SectionLabel({ children }: PropsWithChildren): string {
    return <p class="sec-label">{children}</p>;
}

function JobEntry(job: ExperienceItem): string {
    return (
        <article class="job">
            <div class="job-hd">
                <span class="role">{job.title}</span>
                <span class="dates">{job.dateRange}</span>
            </div>
            <p class="job-meta">
                {job.companyResume ?? job.companyName} <span class="dot">·</span>{' '}
                {job.locationResume ?? job.location}
            </p>
            <ul class="bullets">
                {(job.bullets ?? []).map((b) => (
                    <li>{b}</li>
                ))}
            </ul>
        </article>
    );
}

// Early / military roles render as a single line. The bold lead is `compactName`
// when set (military bolds the organization), otherwise the role title.
function CompactRow(entry: ExperienceItem): string {
    return (
        <p class="compact">
            <strong>{entry.compactName ?? entry.title}</strong>{' '}
            <span class="dot">·</span>{' '}
            <span class="muted">{entry.detail}</span>
            <span class="dates">{entry.dateRange}</span>
        </p>
    );
}

export function Page(): Page {
    const { name, subtitle, contact, summary } = data;

    // The shared dataset holds every role in one array; the résumé only renders
    // professional roles as full entries and early/military as compact one-liners.
    const jobs = data.experience.filter((j) => j.category === 'professional');
    const earlyExperience = data.experience.filter(
        (j) => j.category === 'early',
    );
    const military = data.experience.filter((j) => j.category === 'military');

    // Split experience across two letter pages at the marked break (CoStar),
    // so the on-screen pages match the printed PDF pagination.
    const splitIdx = jobs.findIndex((j) => j.pageBreakBefore);
    const page1Jobs = splitIdx > 0 ? jobs.slice(0, splitIdx) : jobs;
    const page2Jobs = splitIdx > 0 ? jobs.slice(splitIdx) : [];

    return {
        head: (
            <>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossorigin
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap"
                />
                <link rel="stylesheet" href="/resume.css" />
            </>
        ),
        body: (
            <>
                {/* Full-page gate shown on load, CSS-only: the "View" label
                    toggles the hidden checkbox, which hides the gate. */}
                <input type="checkbox" id="intro-dismiss" class="intro-toggle" />
                <div
                    class="intro-gate"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="intro-title"
                >
                    <div class="intro-card">
                        <p class="intro-eyebrow">Résumé</p>
                        <h2 id="intro-title" class="intro-title">
                            {name}
                        </h2>
                        <p class="intro-text">
                            Read the résumé here, or download a PDF copy.
                        </p>
                        <div class="intro-actions">
                            <label
                                for="intro-dismiss"
                                class="intro-btn"
                                role="button"
                                tabindex="0"
                            >
                                View
                            </label>
                            <a
                                class="intro-btn intro-btn-primary"
                                href="/Brian_Reed_Resume.pdf"
                                download
                            >
                                Download
                            </a>
                        </div>
                    </div>
                </div>

                <div class="pages">
                    <div class="page">
                        <header class="hd">
                        <h1 class="name">{name}</h1>
                        <p class="sub">{subtitle}</p>
                        <p class="contact-line">
                            <span>{contact.location}</span>
                            <span class="dot">·</span>
                            <a href={`mailto:${contact.email}`}>
                                {contact.email}
                            </a>
                            <span class="dot">·</span>
                            <span>{contact.phone}</span>
                        </p>
                        <p class="contact-line">
                            {contact.links.map((link, i) => (
                                <>
                                    {i > 0 && <span class="dot">·</span>}
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {link.label}
                                    </a>
                                </>
                            ))}
                        </p>
                    </header>

                    <section>
                        <SectionLabel>Summary</SectionLabel>
                        <p class="summary">{summary}</p>
                    </section>

                    <section>
                        <SectionLabel>Skills</SectionLabel>
                        <div class="skills-grid">
                            {data.skills.map((group) => (
                                <>
                                    <div class="skills-label">
                                        {group.label}
                                    </div>
                                    <div class="skills-values">
                                        {group.items.map((skill, i) => {
                                            const aside = skillAside(skill);
                                            return (
                                                <>
                                                    {i > 0 && (
                                                        <span class="dot">
                                                            ·
                                                        </span>
                                                    )}
                                                    <span class="skill">
                                                        {skill.name}
                                                        {aside && (
                                                            <span class="muted">
                                                                {' '}
                                                                {aside}
                                                            </span>
                                                        )}
                                                    </span>
                                                </>
                                            );
                                        })}
                                    </div>
                                </>
                            ))}
                        </div>
                    </section>

                    <section>
                        <SectionLabel>Experience</SectionLabel>
                        {page1Jobs.map((job) => JobEntry(job))}
                    </section>
                </div>

                <div class="page">
                    <section>
                        {page2Jobs.map((job) => JobEntry(job))}
                        {earlyExperience.map((entry) => CompactRow(entry))}
                    </section>

                    <section>
                        <SectionLabel>Military Service</SectionLabel>
                        {military.map((entry) => CompactRow(entry))}
                    </section>

                    <section>
                        <SectionLabel>Certifications</SectionLabel>
                        {data.certifications.map((cert) => (
                            <p class="cert">
                                <span class="cert-main">
                                    <strong>{cert.title}</strong>{' '}
                                    <span class="dot">·</span>{' '}
                                    <span class="muted">{cert.source}</span>
                                </span>
                                <span class="dates">{cert.year}</span>
                            </p>
                        ))}
                    </section>
                    </div>
                </div>
            </>
        ),
    };
}
