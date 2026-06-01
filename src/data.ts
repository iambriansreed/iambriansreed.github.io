export type ExperienceItem = {
    companyName: string;
    title: string;
    description: string[];
    location: string;
    startedOn: number;
    finishedOn?: number;
    volunteer?: boolean;
    skills: string[];
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

export type ContactLink = {
    title: string;
    href: string;
};

export type QuizQuestion = {
    id: string;
    title: string;
    answers: { title: string; failReason?: string }[];
};

export type SiteData = {
    name: string;
    subtitle: string;
    introduction: string;
    contactLinks: ContactLink[];
    experience: ExperienceItem[];
    projects: Project[];
    questions: QuizQuestion[];
};

const data: SiteData = {
    name: 'Brian S. Reed',
    subtitle: 'Front-End Architect · Staff Engineer',
    introduction:
        'Front-End Architect and Staff Engineer with 15+ years building scalable UI systems. Deep expertise in React, TypeScript, and design systems, with a strong focus on accessibility, performance, and developer experience.',

    contactLinks: [
        { title: 'Message me', href: '#message' },
        {
            title: 'LinkedIn',
            href: 'https://www.linkedin.com/in/iambriansreed/',
        },
        { title: 'GitHub', href: 'https://github.com/iambriansreed' },
    ],

    experience: [
        {
            companyName: 'Anywhere Real Estate Inc.',
            title: 'Senior Software Engineer, Design Systems Specialist, Team Lead',
            location: 'Remote',
            startedOn: 1725494400000,
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
                'Own the architecture, engineering, and adoption of a scalable React component library used across multiple teams and platforms.',
                'Built a custom Figma plugin for design tokens and a TypeScript/JSDoc-generated documentation site, creating a single source of truth between design and code.',
                'Standardized component APIs, docs, and CI/CD integration to improve onboarding, consistency, and delivery velocity.',
            ],
        },
        {
            companyName: 'Butterfly Network, Inc.',
            title: 'Senior Software Engineer, Front-End Focused, Scrum Master',
            location: 'Remote',
            startedOn: 1630468800000,
            finishedOn: 1727740800000,
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
        },
        {
            companyName: 'CoStar Group',
            title: 'Senior Software Engineer, React and TypeScript',
            location: 'Hampton Roads, VA',
            startedOn: 1561953600000,
            finishedOn: 1630468800000,
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
        },
        {
            companyName: 'Anthem, Inc.',
            title: 'Developer Advisor, React Native',
            location: 'Norfolk, VA',
            startedOn: 1548997200000,
            finishedOn: 1561953600000,
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
        },
        {
            companyName: 'ADP',
            title: 'Senior Application Developer',
            location: 'Norfolk, VA',
            startedOn: 1506830400000,
            finishedOn: 1548997200000,
            skills: ['React', 'Node.js', 'Architecture', 'Mentorship', 'UX'],
            description: [
                'Provided technical leadership on front-end implementation, setting quality standards through code reviews and shared best practices.',
                'Helped shape front-end architecture decisions in collaboration with product, UX, and business stakeholders.',
                'Mentored junior engineers and contributed to technical interviews and onboarding, supporting team growth and consistency.',
                'Drove front-end modernization while balancing delivery with long-term maintainability.',
            ],
        },
        {
            companyName: 'Array Digital, LLC.',
            title: 'Software Developer',
            location: 'Chesapeake, VA',
            startedOn: 1422766800000,
            finishedOn: 1506830400000,
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
        },
        {
            companyName: 'City of Virginia Beach',
            title: 'Programmer Analyst, User Experience Design',
            location: 'Virginia Beach, VA',
            startedOn: 1246420800000,
            finishedOn: 1422766800000,
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
        },
        {
            companyName: 'Alutiiq',
            title: 'Web, Graphic, and Print Designer',
            location: 'Virginia Beach, VA',
            startedOn: 1088640000000,
            finishedOn: 1207008000000,
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
        },
        {
            companyName: 'US Army',
            title: 'Transportation Management Coordinator (88N)',
            location: 'Fort Bragg, NC',
            startedOn: 959817600000,
            finishedOn: 1088640000000,
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
        },
        {
            volunteer: true,
            companyName: 'VB Rescue',
            title: 'Emergency Medical Technician (Volunteer)',
            location: 'Virginia Beach, VA',
            startedOn: 1662004800000,
            finishedOn: 1730419200000,
            skills: ['Emergency Medicine', 'Patient Care'],
            description: [
                'Conducted patient assessments and administered treatments during transport.',
                'Delivered compassionate patient care and support to individuals and families during emergencies.',
            ],
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
                    title: 'Npm',
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
