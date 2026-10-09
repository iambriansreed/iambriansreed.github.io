// Single source of truth for both surfaces that render Brian's career:
//  - the iambrian.com site  (src/index.tsx)
//  - the print résumé        (src/resume/index.tsx)
//
// These used to live in two files that drifted apart. They are now merged: every
// role is one ExperienceItem that carries what BOTH renderers need. Where the two
// genuinely differ (job titles, bullet copy, a couple of company/location strings),
// the résumé wording takes precedence: résumé titles now show on the site too.

// Site contact link (footer / nav style).
export type ContactLink = {
    title: string;
    href: string;
};

// Résumé contact link (header line).
export type ResumeLink = {
    label: string;
    href: string;
};

export type SkillItem = {
    name: string;
    // Free-form parenthetical, e.g. "(Claude Code, GitHub Copilot, Cursor)".
    note?: string;
};

export type SkillGroup = {
    label: string;
    items: SkillItem[];
};

export type Certification = {
    title: string;
    source: string;
    year: number;
};

// Which résumé section a role belongs to. The site renders professional/early/
// military as one timeline (and filters out volunteer); the résumé renders
// professional as full entries and early/military as compact one-liners.
export type ExperienceCategory =
    | 'professional'
    | 'early'
    | 'military'
    | 'volunteer';

export type ExperienceItem = {
    category: ExperienceCategory;
    // Mirrors category === 'volunteer'; kept so the site's existing filter works.
    volunteer?: boolean;

    // Shared. Résumé wording takes precedence and is shown on both surfaces.
    title: string;

    // Company / location. The site values are the defaults both surfaces fall back
    // to; the *Resume overrides exist only where the printed résumé copy differs.
    companyName: string;
    companyResume?: string;
    location: string;
    locationResume?: string;

    // Public artifact for the role, shown as a bare domain on the entry's meta
    // line. Bare so it survives PDF text extraction as a usable link.
    link?: string;

    // Dates. Epochs drive the site (sortable + locale-formatted); dateRange is the
    // literal string the résumé prints so the page matches the PDF regardless of
    // the build machine's timezone. Use mid-month UTC epochs to avoid month skew.
    startedOn: number;
    finishedOn?: number;
    dateRange: string;

    skills: string[];

    // Two intentional copies of the same role's accomplishments:
    description: string[]; // web bullets (site)
    bullets?: string[]; // résumé bullets (professional entries)

    // Compact résumé rows (early / military): a bold lead + a single blurb.
    // compactName defaults to title when omitted (used for early entries where the
    // bold lead is the role; military bolds the organization instead).
    compactName?: string;
    detail?: string;

    // A professional role rendered as a compact row on the résumé instead of a
    // full entry: the roles with no measurable outcome on record, so one line
    // beats a list of generic bullets. The site's experience grid ignores it.
    compact?: boolean;

    // Force a print page break before this entry to match the PDF pagination.
    pageBreakBefore?: boolean;
};

export type Project = {
    title: string;
    url: string;
    internal?: boolean;
    thumbnail?: string;
    // A variant for the light theme. With one set, the card carries both as
    // data attributes and client.ts picks the one matching data-theme; without
    // it, `thumbnail` is used in both themes (BSPK, whose card is a screenshot).
    thumbnailLight?: string;
    // Spans two grid columns on screens wide enough for more than one.
    wide?: boolean;
    description: string;
    category: string;
    skills: string[];
    sources: { title: string; url: string; internal?: boolean }[];
};

export type QuizQuestion = {
    id: string;
    title: string;
    answers: { title: string; failReason?: string }[];
};

export type ResumeContact = {
    location: string;
    email: string;
    phone: string;
    links: ResumeLink[];
};

export type SiteData = {
    name: string;
    subtitle: string;
    summary: string; // résumé summary paragraph, and the home page lede
    contact: ResumeContact; // résumé contact block
    contactLinks: ContactLink[]; // site contact links
    skills: SkillGroup[]; // résumé skill groups
    experience: ExperienceItem[];
    projects: Project[];
    questions: QuizQuestion[];
    certifications: Certification[];
};

const data: SiteData = {
    name: 'Brian S. Reed',
    subtitle: 'Design Systems Engineer · Front-End Architect',

    // All three spans derive from the epochs below and need a bump each year:
    // "nearly twenty" from the first software work in 2007 (at Alutiiq),
    // "seven" from the architect title at Anthem (Feb 2019), "two" from BSPK
    // at Anywhere (Oct 2024). Design systems counts BSPK only — the earlier
    // shared-library work is deliberately described as component libraries,
    // not design systems, so the bullets below agree with this sentence. The
    // 19+ also appears in the index.html meta descriptions.
    summary:
        "Nearly twenty years in software, full-stack early, seven in front-end architecture, the last two leading the engineering group behind BSPK, Anywhere Real Estate's design system and its first open-source project. Design-trained, so accessibility and performance are requirements rather than cleanup. I build with AI tools daily, and systems those tools can see. U.S. Army veteran.",

    contact: {
        location: 'Chesapeake, VA (Remote)',
        email: 'me@iambrian.com',
        phone: '(757) 447-4777',
        links: [
            { label: 'iambrian.com', href: 'https://iambrian.com' },
            {
                label: 'linkedin.com/in/iambriansreed',
                href: 'https://www.linkedin.com/in/iambriansreed/',
            },
            {
                label: 'github.com/iambriansreed',
                href: 'https://github.com/iambriansreed',
            },
        ],
    },

    contactLinks: [
        { title: 'Message me', href: '#message' },
        {
            title: 'LinkedIn',
            href: 'https://www.linkedin.com/in/iambriansreed/',
        },
        { title: 'GitHub', href: 'https://github.com/iambriansreed' },
    ],

    // Recruiters skim the first rows, so the framework keywords they filter on
    // lead, then languages, then the specialty that the roles are actually for.
    skills: [
        {
            label: 'Frameworks',
            items: [
                { name: 'React' },
                { name: 'Angular' },
                { name: 'React Native' },
                { name: 'Vite' },
                { name: 'Tailwind CSS' },
            ],
        },
        {
            label: 'Languages',
            items: [
                { name: 'TypeScript' },
                { name: 'JavaScript' },
                { name: 'CSS/SCSS' },
                { name: 'GraphQL' },
                { name: 'Node.js' },
            ],
        },
        {
            label: 'Systems',
            items: [
                { name: 'Design systems' },
                { name: 'Component libraries' },
                { name: 'Design tokens' },
                { name: 'Accessibility (WCAG)' },
                { name: 'Performance' },
            ],
        },
        {
            label: 'Practice',
            items: [
                { name: 'Figma plugin development' },
                { name: 'CI/CD and release automation' },
                {
                    name: 'AI-assisted development',
                    note: 'Claude Code, Copilot, Cursor',
                },
                { name: 'Mentorship' },
            ],
        },
    ],

    experience: [
        {
            category: 'professional',
            title: 'Senior Software Engineer / Front-End Architect',
            // Compass closed its acquisition of Anywhere on 9 Jan 2026, and
            // LinkedIn lists the role under Compass. One entry rather than two,
            // since the role did not change; the bullets keep saying Anywhere
            // because BSPK was built there, as the case study tells it.
            companyName: 'Compass (formerly Anywhere Real Estate)',
            companyResume: 'Compass, formerly Anywhere Real Estate',
            location: 'Remote',
            // Off until the fork is live at bspk.iambrian.com — pointing at an
            // employer-controlled domain risks a dead link on a résumé already
            // in circulation. Set `link` to re-enable; the rendering is in place.
            // link: 'bspk.iambrian.com',
            startedOn: 1728993600000,
            dateRange: 'Oct 2024 – Present',
            skills: [
                'TypeScript',
                'React',
                'Design Systems',
                'Figma Plugin',
                'CI/CD',
                'Team Leadership',
            ],
            // Figures here (86 components, 10 brands, 62 releases, 2,000+
            // tokens) are the case study's, src/bspk/content.ts. Change them
            // there first, then here, and regenerate public/Brian_Reed_Resume.pdf.
            // The home page shows the first three, so the AI port sits third.
            description: [
                "Built BSPK, Anywhere Real Estate's design system, from zero as its only engineer, then led the team of three that grew it to 86 React components and an Angular library serving 10 brands across 62 releases.",
                'Built the Figma plugin that syncs 2,000+ design tokens into per-brand stylesheets, with a build check that fails on any unknown token, so design renames surface at build time rather than in production.',
                'Ported BSPK to Angular with AI coding tools: 88 components on the React stylesheets unchanged, so both libraries render the same DOM and behave the same for assistive technology.',
                "Built the documentation site out of BSPK's own components, with axe-core running on every live example, so accessibility checks kept working after the team lost its dedicated reviewer.",
                "Made BSPK the company's first open-source project; teams were still shipping on it and asking for upgrades after the funded work ended.",
            ],
            // Kept to two lines each so page one of the PDF still holds this
            // role and the next; a longer section jumps to page two whole.
            bullets: [
                "Built BSPK, Anywhere's design system, from zero as its only engineer, then led a team of three to 86 React components, 10 brand themes and 62 releases.",
                'Built the Figma plugin that syncs 2,000+ design tokens into per-brand stylesheets, with a build check that fails on any unknown token.',
                'Ported BSPK to Angular with AI coding tools: 88 components on the same stylesheets, rendering the same DOM for assistive technology.',
                "Built the docs site from BSPK's own components, with axe-core on every live example, so accessibility checks outlived the team's dedicated reviewer.",
                "Made BSPK the company's first open-source project; teams were still shipping on it and requesting upgrades after the funded work ended.",
            ],
        },
        {
            category: 'professional',
            title: 'Senior Software Engineer / Front-End Lead',
            companyName: 'Butterfly Network, Inc.',
            location: 'Remote',
            startedOn: 1630468800000,
            finishedOn: 1728993600000,
            dateRange: 'Sep 2021 – Oct 2024',
            skills: [
                'React',
                'TypeScript',
                'User Experience (UX)',
                'Scrum',
                'Design Systems',
                'Component Libraries',
            ],
            description: [
                'Led development and evolution of the shared React component library supporting a cloud-based SaaS platform.',
                'Partnered closely with product managers and designers to translate requirements into clear technical specifications and well-scoped user stories.',
                'Served as Certified Scrum Master, facilitating agile ceremonies and improving team delivery through clearer dependency tracking and process improvements.',
                'Helped remove technical and organizational blockers, increasing team efficiency and predictability.',
            ],
            bullets: [
                "Ran the team's process as Certified ScrumMaster, cutting defects and rework through tighter acceptance criteria and front-end testing.",
                'Led the shared React component library behind a cloud-based enterprise SaaS platform.',
                'Partnered with product and design to turn business requirements into technical specifications and well-scoped stories.',
            ],
        },
        {
            category: 'professional',
            title: 'Senior Software Engineer (Frontend Focused)',
            companyName: 'CoStar Group',
            location: 'Richmond, VA',
            startedOn: 1561953600000,
            finishedOn: 1630468800000,
            dateRange: 'Jul 2019 – Sep 2021',
            pageBreakBefore: true,
            skills: [
                'React',
                'TypeScript',
                'UI Libraries',
                'Accessibility',
                'User Experience Design (UED)',
            ],
            description: [
                'Core contributor to a large shared React component library used across multiple product teams.',
                'Owned key parts of the component platform; API design, documentation patterns, and long-term maintainability.',
                'Defined standards for reusable components, accessibility, and performance across desktop and mobile web.',
                'Served as a technical point of contact for shared UI infrastructure, influencing architecture and reducing duplicated UI work.',
            ],
            bullets: [
                'Rearchitected a large shared React UI library used across multiple business units for long-term maintainability.',
                'Owned component API design and documentation patterns, setting standards for reusability, accessibility, and performance across desktop and mobile web.',
            ],
        },
        {
            category: 'professional',
            title: 'Engineer Advisor / React Native Architect',
            companyName: 'Anthem, Inc.',
            location: 'Norfolk, VA',
            startedOn: 1548997200000,
            finishedOn: 1561953600000,
            dateRange: 'Feb 2019 – Jul 2019',
            compact: true,
            detail: 'Anthem, Inc. · Norfolk, VA · Unified several teams on one React Native architecture with reusable cross-platform component patterns.',
            skills: [
                'React Native',
                'React',
                'Cross-platform UI',
                'Architecture',
            ],
            description: [
                'Unified multiple teams around a rebuilt internal React Native framework used across several mobile applications.',
                'Designed high-level, reusable component patterns to support scalability across products and regions.',
                'Improved performance, maintainability, and consistency of mobile front-end implementations.',
            ],
            bullets: [
                'Unified several teams on one React Native architecture, with reusable cross-platform component patterns for scale and consistency.',
            ],
        },
        {
            category: 'professional',
            title: 'Senior Application Engineer (Frontend Focused)',
            companyName: 'ADP',
            location: 'Norfolk, VA',
            startedOn: 1506830400000,
            finishedOn: 1548997200000,
            dateRange: 'Oct 2017 – Feb 2019',
            compact: true,
            detail: 'ADP · Norfolk, VA · Set front-end quality standards through code review and shaped architecture decisions with product and UX while modernizing legacy code.',
            skills: ['React', 'Node.js', 'Architecture', 'Mentorship', 'UX'],
            description: [
                'Provided technical leadership on front-end implementation, setting quality standards through code reviews and shared best practices.',
                'Helped shape front-end architecture decisions in collaboration with product, UX, and business stakeholders.',
                'Mentored junior engineers and contributed to technical interviews and onboarding, supporting team growth and consistency.',
                'Drove front-end modernization while balancing delivery with long-term maintainability.',
            ],
            bullets: [
                'Set front-end quality standards through code review and shared practice; shaped architecture decisions with product and UX while modernizing legacy code.',
            ],
        },
        {
            category: 'professional',
            title: 'Software Developer',
            // 80/20 Software Consulting merged into Array Digital during this
            // role, so it is one entry under the current name, like Compass.
            companyName: 'Array Digital (formerly 80/20 Software Consulting)',
            companyResume: 'Array Digital, formerly 80/20 Software Consulting',
            location: 'Chesapeake, VA',
            startedOn: 1422766800000,
            finishedOn: 1506830400000,
            dateRange: 'Feb 2015 – Oct 2017',
            compact: true,
            detail: 'Array Digital, formerly 80/20 Software Consulting · Chesapeake, VA · React and Angular apps for finance clients on Node.js, PHP, and ASP.NET.',
            skills: [
                'React',
                'Angular',
                'Node.js',
                'ASP.NET Web API',
                'PHP',
                'Ionic / Cordova',
            ],
            description: [
                'Built and maintained production React front-end applications for finance and enterprise clients, focusing on performance, usability, and maintainability.',
                'Developed Angular and React applications per client needs, helping teams transition toward modern front-end architectures.',
                'Built back-end services with ASP.NET Web API, Node.js, and PHP, and shipped hybrid mobile apps with Ionic and Cordova.',
                'Translated UX requirements into reusable components and incrementally modernized legacy ASP.NET WebForms applications.',
            ],
            bullets: [
                'Built React and Angular apps for finance clients on Node.js, PHP, and ASP.NET.',
            ],
        },
        {
            category: 'professional',
            title: 'Software Engineer II',
            companyName: 'City of Virginia Beach',
            location: 'Virginia Beach, VA',
            startedOn: 1246420800000,
            finishedOn: 1422766800000,
            dateRange: 'Jul 2009 – Feb 2015',
            compact: true,
            detail: 'City of Virginia Beach · Virginia Beach, VA · Public-facing web apps and custom mapping tools (Google Maps, ESRI APIs).',
            skills: [
                'User Experience Design (UED)',
                'C#',
                'Google Maps & ESRI APIs',
                'SharePoint',
            ],
            description: [
                'Developed custom mapping applications using Google Maps and ESRI APIs.',
                'Built a SharePoint-based content management system to streamline content creation and publishing.',
                'Designed and implemented custom SharePoint web parts including galleries, video libraries, and calendars.',
                'Created visually consistent, brand-aligned websites and internal tools.',
            ],
            bullets: [
                'Built public-facing web apps and custom mapping tools (Google Maps, ESRI APIs).',
            ],
        },
        {
            category: 'early',
            title: 'Web, Graphic, and Print Designer',
            companyName: 'Alutiiq',
            location: 'Virginia Beach, VA',
            startedOn: 1088640000000,
            finishedOn: 1207008000000,
            dateRange: '2004 – 2008',
            skills: [
                'User Experience Design (UED)',
                'JavaScript',
                'PHP',
                'MySQL',
            ],
            description: [
                'Designed and built a custom PHP and MySQL-based content management system.',
                'Produced marketing collateral including brochures, booklets, signage, and trade show materials.',
                'Supported brand presence through large-scale visual design work.',
            ],
            detail: 'Alutiiq · Design-trained foundation: brand, print, and a custom PHP/MySQL CMS',
        },
        {
            category: 'military',
            title: 'Transportation Management Coordinator (88N)',
            companyName: 'US Army',
            location: 'Fort Bragg, NC',
            startedOn: 959817600000,
            finishedOn: 1088640000000,
            dateRange: '2000 – 2004',
            skills: [
                'Leadership',
                'Logistics',
                'Organizational Capability',
                'Operations',
            ],
            description: [
                'Managed logistics and transportation operations across multiple deployments.',
                'Recognized for ingenuity and leadership with multiple awards.',
                'Served as Ground Liaison Officer to the Air Operations Center, a role typically reserved for commissioned officers.',
            ],
            compactName: 'United States Army',
            detail: 'Transportation Management Coordinator (88N), Fort Bragg, NC · Led logistics across multiple deployments; served as Ground Liaison Officer to the Air Operations Center, a role normally held by commissioned officers.',
        },
        {
            category: 'volunteer',
            volunteer: true,
            title: 'Emergency Medical Technician (Volunteer)',
            companyName: 'VB Rescue',
            location: 'Virginia Beach, VA',
            startedOn: 1662004800000,
            finishedOn: 1730419200000,
            dateRange: 'Sep 2022 – Nov 2024',
            skills: ['Emergency Medicine', 'Patient Care'],
            description: [
                'Conducted patient assessments and administered treatments during transport.',
                'Delivered compassionate patient care and support to individuals and families during emergencies.',
            ],
            // Sits directly above the NREMT certification on the résumé, which
            // otherwise appears with nothing behind it.
            compactName: 'Emergency Medical Technician',
            detail: 'Virginia Beach EMS · Patient assessment and emergency care in transport',
        },
    ],

    certifications: [
        {
            title: 'Certified ScrumMaster (CSM)',
            source: 'Scrum Alliance',
            year: 2021,
        },
        {
            title: 'NREMT EMT-Specialist',
            source: 'National Registry of Emergency Medical Technicians',
            year: 2023,
        },
    ],

    projects: [
        {
            title: 'BSPK',
            // The write-up at src/bspk. The docs sites and GitHub links are the
            // forks under iambrian.com and iambriansreed, not the Anywhere
            // originals, so nothing here depends on an employer domain.
            url: '/bspk/',
            internal: true,
            // The share image for /bspk is public/bspk-figures/bspk-banner-*.png,
            // not a card thumbnail.
            thumbnail: 'projects/bspk.svg',
            wide: true,
            description:
                "Anywhere Real Estate's design system, built from zero for all of its brands. React and Angular libraries share one set of stylesheets, and it became the company's first open-source project.",
            category: 'Design Systems',
            skills: ['React', 'Angular', 'TypeScript', 'Accessibility'],
            sources: [
                {
                    title: 'Case study',
                    url: '/bspk/',
                    internal: true,
                },
                {
                    title: 'Live docs',
                    url: 'https://bspk.iambrian.com',
                },
                {
                    title: 'Angular docs',
                    url: 'https://ngx.bspk.iambrian.com',
                },
                {
                    title: 'React code',
                    url: 'https://github.com/iambriansreed/bspk-ui',
                },
                {
                    title: 'Angular code',
                    url: 'https://github.com/iambriansreed/bspk-ui-ngx',
                },
            ],
        },
        {
            title: 'Skrapa',
            url: 'https://iambrian.com/skrapa',
            thumbnail: 'projects/skrapa.svg',
            thumbnailLight: 'projects/skrapa-light.svg',
            description:
                'A zero-config static site generator that renders TypeScript JSX templates and client code into a single HTML file; no framework, no virtual DOM, no third-party bundler. It builds this very site. Written by hand at first, then cleaned up and improved dramatically with Claude Code.',
            category: 'Dev Tools',
            skills: ['TypeScript', 'JSX', 'Node.js', 'CLI'],
            sources: [
                {
                    title: 'Frontend',
                    url: 'https://github.com/iambriansreed/skrapa',
                },
                {
                    title: 'npm',
                    url: 'https://www.npmjs.com/package/skrapa',
                },
            ],
        },
        {
            title: 'Menu OTP',
            url: 'https://otp.iambrian.com',
            // Two alternates sit beside this one in public/projects:
            // menu-otp-alt-code.svg (the six-digit display) and
            // menu-otp-alt-mark.svg (the app icon + wordmark).
            thumbnail: 'projects/menu-otp.svg',
            thumbnailLight: 'projects/menu-otp-light.svg',
            description:
                'A native macOS menu bar app for two-factor codes: click an account, its current six-digit code is on the clipboard. Accounts are AES-256 encrypted with the key in the login Keychain, and no secret ever leaves the Mac. Rewritten with AI from a memory-hungry Electron app into a light native Swift one.',
            category: 'Apps',
            skills: ['Swift 6', 'AppKit', 'macOS', 'Cryptography'],
            sources: [
                {
                    title: 'Source',
                    url: 'https://github.com/iambriansreed/menu-otp',
                },
                {
                    title: 'Download',
                    url: 'https://github.com/iambriansreed/menu-otp/releases/latest',
                },
            ],
        },
        {
            title: 'Sordle',
            url: 'https://sordle.iambrian.com',
            thumbnail: 'projects/sordle.svg',
            thumbnailLight: 'projects/sordle-light.svg',
            description:
                'A Wordle clone without the daily limit. The word bank is a set of static JSON files, one per word, served from GitHub Pages, and every solved word comes with its dictionary definition.',
            category: 'Games',
            skills: ['TypeScript', 'SASS', 'Vite'],
            sources: [
                {
                    title: 'Frontend',
                    url: 'https://github.com/iambriansreed/sordle',
                },
                {
                    title: 'Backend',
                    url: 'https://github.com/iambriansreed/sordle-words',
                },
            ],
        },
        {
            title: 'Connect 4',
            url: 'https://connect4.iambrian.com',
            thumbnail: 'projects/connect4.svg',
            thumbnailLight: 'projects/connect4-light.svg',
            description:
                'Connect Four against a rule-based AI: it takes a win, blocks yours, builds toward three in a row and avoids handing you a move, with a random fallback. Beatable, but it punishes an obvious mistake.',
            category: 'Games',
            skills: ['TypeScript', 'SASS', 'Vite'],
            sources: [
                {
                    title: 'Frontend',
                    url: 'https://github.com/iambriansreed/connect4',
                },
            ],
        },
        // {
        //     title: 'Comms',
        //     url: 'https://chat.iambrian.com',
        //     thumbnail: 'projects/comms.svg',
        //     description:
        //         'A chat client over Socket.IO with nothing stored on the server: it relays messages between up to five people in a room, so a conversation lives only in the browsers that are in it.',
        //     category: 'Apps',
        //     skills: ['TypeScript', 'Socket.io', 'Tailwind', 'Vite'],
        //     sources: [
        //         {
        //             title: 'Frontend',
        //             url: 'https://github.com/iambriansreed/comm-client',
        //         },
        //         {
        //             title: 'Backend',
        //             url: 'https://github.com/iambriansreed/comm-server',
        //         },
        //     ],
        // },
    ],

    questions: [
        {
            id: 'remote',
            title: 'Is this role 100% remote?',
            answers: [
                { title: 'Yes' },
                {
                    title: 'No',
                    failReason: 'I am only taking roles that are 100% remote.',
                },
            ],
        },
        {
            id: 'education',
            title: 'This role requires:',
            answers: [
                {
                    title: "A bachelor's or master's degree",
                    failReason:
                        "Even though I love learning, I don't have a college degree.",
                },
                {
                    title: 'A degree OR equivalent experience of at least 10 years',
                },
                {
                    title: 'A degree OR equivalent experience of at least 5 years',
                },
            ],
        },
        {
            id: 'role',
            title: 'What type of role is this?',
            answers: [
                {
                    title: 'Junior / Intermediate',
                    failReason: 'I am looking for a Senior or higher role.',
                },
                { title: 'Senior / Team Lead' },
                { title: 'Principal / Staff' },
                { title: 'Architect / Advisor' },
                { title: 'Other' },
            ],
        },
        {
            // Rendered as a number input plus a "not disclosed" checkbox
            // (index.tsx), so the only answer here is the one that fails.
            id: 'compensation',
            title: 'What is the annual base compensation, salary not including bonuses?',
            answers: [
                {
                    title: 'Unavailable',
                    failReason:
                        "A role without compensation transparency is one I can't evaluate yet; happy to talk once there's a range.",
                },
            ],
        },
        {
            // Rendered as multi-select pills (index.tsx). No answer fails:
            // a stack outside the ones listed is a stretch, not a stop.
            id: 'expertise',
            title: 'This role requires expert knowledge in:',
            answers: [
                { title: 'Design Systems' },
                { title: 'Figma' },
                { title: 'Accessibility' },
                { title: 'React' },
                { title: 'React Native' },
                { title: 'Angular' },
                { title: 'iOS' },
                { title: 'Android' },
                { title: 'Java' },
                { title: 'Python' },
                { title: 'Other' },
            ],
        },
        {
            id: 'employment',
            title: 'What type of employment is this?',
            answers: [
                { title: 'Full Time / Direct Hire' },
                { title: 'Contract to Hire' },
                { title: 'Freelance / 1099' },
            ],
        },
        {
            id: 'interviews',
            title: 'How many interviews are part of the hiring process?',
            answers: [
                { title: '3 or fewer' },
                { title: '4' },
                { title: '5 or more' },
            ],
        },
        {
            id: 'vacation',
            title: 'How much paid time off comes with the role, not counting holidays?',
            answers: [
                { title: 'Unlimited or flexible' },
                { title: '4 weeks or more' },
                { title: '3 weeks' },
                { title: '2 weeks or less' },
                { title: 'Not sure yet' },
            ],
        },
    ],
};

export default data;
