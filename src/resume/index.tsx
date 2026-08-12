import data from '../data';
import type { SkillItem, ExperienceItem } from '../data';

// "(note)" suffix rendered in muted text after a skill name.
function skillAside(skill: SkillItem): string | null {
    return skill.note ? `(${skill.note})` : null;
}

// Inline separator for contact / skills / meta runs. The surrounding spaces are
// real text nodes on purpose: they are the only line-break opportunities in
// these runs, since each item either is or contains a nowrap atom.
function Dot() {
    return (
        <>
            {' '}
            <span class="dot">·</span>{' '}
        </>
    );
}

// A section is the page grid: label in the left rail, content in the wide
// column. Every section uses it, so the whole page hangs off two alignments.
function Section({
    label,
    children,
}: Skrapa.PropsWithChildren & { label: string }) {
    return (
        <section class="sec">
            <h2 class="sec-label">{label}</h2>
            <div class="sec-body">{children}</div>
        </section>
    );
}

// Role and dates share a line, and each entry is a self-contained block. That
// ordering matters beyond looks: an untagged PDF is read geometrically, and a
// separate date column gets hoisted away from the roles it belongs to.
function EntryHead({ title, dates }: { title: string; dates: string }) {
    return (
        <div class="job-hd">
            <h3 class="role">{title}</h3>
            <span class="dates">{dates}</span>
        </div>
    );
}

function JobEntry(job: ExperienceItem) {
    return (
        <article class="job">
            <EntryHead title={job.title} dates={job.dateRange} />
            <p class="job-meta">
                {job.companyResume ?? job.companyName}
                <Dot />
                {job.locationResume ?? job.location}
                {job.link && (
                    <>
                        <Dot />
                        <a class="job-link" href={`https://${job.link}`}>
                            {job.link}
                        </a>
                    </>
                )}
            </p>
            <ul class="bullets">
                {(job.bullets ?? []).map((b) => (
                    <li>{b}</li>
                ))}
            </ul>
        </article>
    );
}

// Early / military rows: one head line plus a single blurb, no bullets. The
// bold lead is `compactName` when set (military bolds the organization).
function CompactRow(entry: ExperienceItem) {
    return (
        <article class="job compact">
            <EntryHead
                title={entry.compactName ?? entry.title}
                dates={entry.dateRange}
            />
            <p class="job-meta">{entry.detail}</p>
        </article>
    );
}

export function Page(): Skrapa.Page {
    const { name, subtitle, contact, summary } = data;

    // The shared dataset holds every role in one array; the résumé only renders
    // professional roles as full entries and early/military as compact rows.
    const jobs = data.experience.filter((j) => j.category === 'professional');
    const earlyExperience = data.experience.filter(
        (j) => j.category === 'early',
    );
    const military = data.experience.filter((j) => j.category === 'military');
    const volunteer = data.experience.filter((j) => j.category === 'volunteer');

    // Split experience across two letter pages at the marked break, so the
    // on-screen pages match the printed PDF pagination.
    const splitIdx = jobs.findIndex((j) => j.pageBreakBefore);
    const page1Jobs = splitIdx > 0 ? jobs.slice(0, splitIdx) : jobs;
    const page2Jobs = splitIdx > 0 ? jobs.slice(splitIdx) : [];

    return {
        body: (
            <>
                {/* A native <dialog> opened with showModal(). The focus trap,
                    Esc-to-close, and real inertness for the pages behind all
                    come from the browser — none of the three is reachable from
                    CSS, which is why the previous checkbox gate could not offer
                    them. role=dialog and aria-modal are implicit here, so the
                    markup no longer claims anything it cannot honour.

                    If the script never runs the dialog simply stays closed and
                    the résumé is immediately readable, which is the right way
                    for a splash screen to fail. */}
                <dialog class="intro-card" aria-labelledby="intro-title">
                    <p class="intro-eyebrow">Résumé</p>
                    <h2 id="intro-title" class="intro-title">
                        {name}
                    </h2>
                    <p class="intro-text">
                        Read the résumé here, or download a PDF copy.
                    </p>
                    <div class="intro-actions">
                        {/* showModal() moves focus here on open, so the primary
                            action is where the keyboard already is. */}
                        <button
                            type="button"
                            class="intro-btn"
                            data-intro-close
                            autofocus
                        >
                            View
                        </button>
                        <a
                            class="intro-btn intro-btn-primary"
                            href="/Brian_Reed_Resume.pdf"
                            download
                            data-intro-close
                        >
                            Download
                        </a>
                    </div>
                </dialog>

                {/* Deliberately here rather than at the end of <body>: a classic
                    script blocks parsing, so the modal is up before the résumé
                    pages below are parsed. No flash of ungated content. */}
                <script src="./client.ts"></script>

                <div class="pages">
                    <div class="page">
                        <header class="hd">
                            <h1 class="name">{name}</h1>
                            <p class="sub">{subtitle}</p>
                            <p class="contact-line">
                                <span>{contact.location}</span>
                                <Dot />
                                <a href={`mailto:${contact.email}`}>
                                    {contact.email}
                                </a>
                                <Dot />
                                <span>{contact.phone}</span>
                            </p>
                            <p class="contact-line">
                                {contact.links.map((link, i) => (
                                    <>
                                        {i > 0 && <Dot />}
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

                        <Section label="Summary">
                            <p class="summary">{summary}</p>
                        </Section>

                        <Section label="Skills">
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
                                                        {i > 0 && <Dot />}
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
                        </Section>

                        <Section label="Experience">
                            {page1Jobs.map((job) => JobEntry(job))}
                        </Section>
                    </div>

                    <div class="page">
                        <Section label="Experience continued">
                            {page2Jobs.map((job) => JobEntry(job))}
                            {earlyExperience.map((entry) => CompactRow(entry))}
                        </Section>

                        <Section label="Military Service">
                            {military.map((entry) => CompactRow(entry))}
                        </Section>

                        {/* Placed between Military Service and Certifications
                            so the EMT role lands next to the NREMT credential
                            it accounts for. */}
                        <Section label="Volunteer">
                            {volunteer.map((entry) => CompactRow(entry))}
                        </Section>

                        <Section label="Certifications">
                            {data.certifications.map((cert) => (
                                <article class="job compact">
                                    <EntryHead
                                        title={cert.title}
                                        dates={String(cert.year)}
                                    />
                                    <p class="job-meta">{cert.source}</p>
                                </article>
                            ))}
                        </Section>
                    </div>
                </div>
            </>
        ),
    };
}
