// Single source of truth for both surfaces that render Brian's career:
//  - the iambrian.com site  (src/index.tsx)
//  - the print résumé        (src/resume/index.tsx)
//
// These used to live in two files that drifted apart. They are now merged: every
// role is one ExperienceItem that carries what BOTH renderers need. Where the two
// genuinely differ (job titles, bullet copy, a couple of company/location strings),
// the résumé wording takes precedence — résumé titles now show on the site too.

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
    // Years of experience, rendered as "(N yrs)" in muted text on the résumé.
    years?: number;
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

    // Force a print page break before this entry to match the PDF pagination.
    pageBreakBefore?: boolean;
};

export type Project = {
    title: string;
    url: string;
    thumbnail?: string;
    description: string;
    category: string;
    skills: string[];
    sources: { title: string; url: string }[];
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
    introduction: string; // site hero copy
    summary: string; // résumé summary paragraph
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

    introduction:
        'Front-End Architect and Staff Engineer with 15+ years building scalable UI systems. Deep expertise in React, TypeScript, and design systems, with a strong focus on accessibility, performance, and developer experience.',

    summary:
        'Front-End Architect and Staff-level engineer with 15+ years building scalable UI systems. Deep expertise in React, TypeScript, and design systems, with a strong focus on accessibility, performance, and developer experience. Known for translating ambiguous requirements into durable architecture, mentoring engineers across teams, and leveraging AI tooling (Claude Code, GitHub Copilot, Cursor) to accelerate delivery without sacrificing quality. U.S. Army veteran.',

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

    skills: [
        {
            label: 'Languages',
            items: [
                { name: 'JavaScript', years: 15 },
                { name: 'TypeScript', years: 8 },
                { name: 'CSS/SCSS', years: 15 },
                { name: 'GraphQL', years: 5 },
                { name: 'Node.js' },
            ],
        },
        {
            label: 'Frameworks',
            items: [
                { name: 'React', years: 9 },
                { name: 'Angular', years: 6 },
                { name: 'React Native', years: 2 },
                { name: 'Vite' },
                { name: 'Tailwind CSS' },
            ],
        },
        {
            label: 'Architecture',
            items: [
                { name: 'Design Systems', years: 8 },
                { name: 'Component Libraries' },
                { name: 'Accessibility / WCAG', years: 6 },
                { name: 'Performance Optimization', years: 10 },
                { name: 'CI/CD', years: 6 },
            ],
        },
        {
            label: 'Practice',
            items: [
                {
                    name: 'AI-Assisted Development',
                    note: 'Claude Code, GitHub Copilot, Cursor',
                },
                { name: 'Figma and Design Tokens' },
                { name: 'Technical Leadership and Mentorship', years: 10 },
            ],
        },
    ],

    experience: [
        {
            category: 'professional',
            title: 'Senior Software Engineer / Front-End Architect',
            companyName: 'Anywhere Real Estate Inc.',
            companyResume: 'Anywhere Real Estate',
            location: 'Remote',
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
            description: [
                'Lead the design systems engineering group; setting technical direction, prioritization, and day-to-day mentorship while partnering with design leadership and product.',
                'Own the architecture, engineering, and adoption of a scalable React component library of 90+ components used across multiple teams and platforms.',
                'Built a custom Figma plugin for 2,000+ design tokens across 10 brand themes and a TypeScript/JSDoc-generated documentation site, creating a single source of truth between design and code.',
                'Standardized component APIs, docs, and CI/CD integration to improve onboarding, consistency, and delivery velocity.',
            ],
            bullets: [
                'Lead the design systems engineering group: set technical direction and priorities, mentor engineers day to day, and partner with design leadership and product.',
                'Own the architecture and adoption of a scalable React and Angular design system of 90+ components each, used across multiple product teams and platforms.',
                'Built a custom Figma plugin that syncs 2,000+ design tokens across 10 brand themes between design and code, plus a TypeScript/JSDoc-generated documentation site as a single source of truth.',
                'Standardized component APIs, documentation, and CI/CD release workflows, improving onboarding, consistency, and delivery velocity.',
                'Established front-end standards for performance, accessibility (WCAG), and developer experience, accelerating delivery with AI tooling (Claude Code, GitHub Copilot, Cursor).',
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
                'Led development and evolution of a shared front-end design system and React component library supporting a cloud-based SaaS platform.',
                'Partnered closely with product managers and designers to translate requirements into clear technical specifications and well-scoped user stories.',
                'Served as Certified Scrum Master, facilitating agile ceremonies and improving team delivery through clearer dependency tracking and process improvements.',
                'Helped remove technical and organizational blockers, increasing team efficiency and predictability.',
            ],
            bullets: [
                'Led development and evolution of a shared design system and React component library supporting a cloud-based enterprise SaaS platform.',
                'Partnered with product managers and designers to translate business requirements into clear technical specifications and well-scoped user stories.',
                'Served as Certified Scrum Master, improving delivery predictability through clearer dependency tracking and process improvements.',
                'Reduced defects and rework through tighter acceptance criteria and stronger front-end testing strategies.',
            ],
        },
        {
            category: 'professional',
            title: 'Senior Software Engineer (Frontend Focused)',
            companyName: 'CoStar Group',
            location: 'Hampton Roads, VA',
            locationResume: 'Richmond, VA',
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
                'Core contributor to a large shared React UI library used across multiple business units; led its re-architecture for long-term maintainability.',
                'Owned component API design and documentation patterns; defined standards for reusability, accessibility, and performance across desktop and mobile web.',
                'Mentored engineers on front-end best practices, testing, and component design.',
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
                'Unified multiple teams around a shared React Native architecture; designed reusable cross-platform component patterns to improve scalability, performance, and consistency.',
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
            skills: ['React', 'Node.js', 'Architecture', 'Mentorship', 'UX'],
            description: [
                'Provided technical leadership on front-end implementation, setting quality standards through code reviews and shared best practices.',
                'Helped shape front-end architecture decisions in collaboration with product, UX, and business stakeholders.',
                'Mentored junior engineers and contributed to technical interviews and onboarding, supporting team growth and consistency.',
                'Drove front-end modernization while balancing delivery with long-term maintainability.',
            ],
            bullets: [
                'Set front-end quality standards through code reviews and shared best practices; mentored junior engineers and contributed to technical interviews.',
                'Shaped front-end architecture decisions with product, UX, and business stakeholders while driving modernization of legacy code.',
            ],
        },
        {
            category: 'professional',
            title: 'Software Developer',
            companyName: 'Array Digital, LLC.',
            companyResume: '80/20 Software Consulting · Array Digital, LLC',
            location: 'Chesapeake, VA',
            locationResume: 'Virginia Beach, VA',
            startedOn: 1422766800000,
            finishedOn: 1506830400000,
            dateRange: 'Feb 2015 – Oct 2017',
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
                'Built production React and Angular applications for finance and enterprise clients, with back-end services in Node.js, PHP, and ASP.NET Web API.',
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
                'Designed and built public-facing web applications, custom mapping tools (Google Maps, ESRI APIs), and SharePoint-based CMS components with a focus on accessible, user-friendly UI.',
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
            detail: 'Alutiiq · Design-trained foundation: brand and print work plus a custom PHP/MySQL CMS',
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
            detail: 'Transportation Management Coordinator (88N), Fort Bragg, NC · Led logistics operations across multiple deployments; served as Ground Liaison Officer to the Air Operations Center, a role typically held by commissioned officers',
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
            title: 'Skrapa',
            url: 'https://iambrian.com/skrapa',
            thumbnail: 'projects/skrapa.svg',
            description:
                'A zero-config static site generator that renders TypeScript JSX templates and client code into a single HTML file; no framework, no virtual DOM, no bundler. It builds this very site.',
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
            title: 'Sordle',
            url: 'https://sordle.iambrian.com',
            thumbnail: 'projects/sordle.svg',
            description:
                'Enjoy unlimited Wordle games with this Wordle clone. Features a static backend and provides the definition of each word.',
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
            description:
                'Challenge yourself to a game of Connect 4 against a basic AI, competitive enough to keep you entertained but still beatable.',
            category: 'Games',
            skills: ['TypeScript', 'SASS', 'Vite'],
            sources: [
                {
                    title: 'Frontend',
                    url: 'https://github.com/iambriansreed/connect4',
                },
            ],
        },
        {
            title: 'Comms',
            url: 'https://chat.iambrian.com',
            thumbnail: 'projects/comms.svg',
            description:
                "A chat application supporting multiple private rooms, with data stored exclusively on clients' devices.",
            category: 'Apps',
            skills: ['TypeScript', 'Socket.io', 'Tailwind', 'Vite'],
            sources: [
                {
                    title: 'Frontend',
                    url: 'https://github.com/iambriansreed/comm-client',
                },
                {
                    title: 'Backend',
                    url: 'https://github.com/iambriansreed/comm-server',
                },
            ],
        },
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
                    title: 'A bachelors or masters degree',
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
                { title: 'Other' },
                { title: 'Senior' },
                { title: 'Team Lead' },
                { title: 'Architect / Advisor' },
            ],
        },
        {
            id: 'compensation',
            title: 'What is the annual base compensation, salary not including bonuses?',
            answers: [
                {
                    title: 'Unavailable',
                    failReason:
                        "If budgets aren't transparent we can't move forward.",
                },
                { title: 'below $150k' },
                { title: '$150k - $200k' },
                { title: '$200k - $250k' },
                { title: 'above $250k' },
            ],
        },
        {
            id: 'sign-on-bonus',
            title: 'Is a sign-on bonus available?',
            answers: [{ title: 'Yes' }, { title: 'No' }],
        },
        {
            id: 'expertise',
            title: 'This role requires expert knowledge in:',
            answers: [
                {
                    title: 'Java / Python',
                    failReason:
                        'I am not an expert in Java or Python. I do have experience in other OOP languages, like C#.',
                },
                { title: 'React' },
                { title: 'React Native' },
                { title: 'Angular' },
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
                { title: '3 or less' },
                { title: '4 or more' },
                { title: '5 or more' },
            ],
        },
        {
            id: 'vacation',
            title: "How is the company's PTO benefit structured?",
            answers: [
                { title: 'Unlimited' },
                { title: '20 days or more including holidays' },
                { title: '10 days or more excluding holidays' },
                { title: 'Other' },
            ],
        },
    ],
};

export default data;
