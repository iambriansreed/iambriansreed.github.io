/* ---------- People ---------- */
/* Each color does double duty: white-on-color for a pressed filter chip, and
   color-on-card for the name under a task. Both are text, so every entry is
   held at >= 5:1 against both #fffdf8 and white — that is what pins them to
   this luminance band. Hues are the originals; only lightness moved. */
export const PEOPLE = {
    Brian: { color: '#1f6f6b' },
    Heather: { color: '#b15235' },
    Ry: { color: '#7a5bb0' },
    Sean: { color: '#2b71b0' },
    Jack: { color: '#327c47' },
    Nathan: { color: '#946510' },
} satisfies Record<string, { color: string }>;

export type Person = keyof typeof PEOPLE;

/* Chip order is the roster order — derived so the two can't drift apart. */
export const ORDER = Object.keys(PEOPLE) as Person[];

/* Days in chart order, starting Friday */
export const DAYS = ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'] as const;
/* Long form for the card headings; index-aligned to DAYS */
export const DAY_NAMES = [
    'Friday',
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
];
/* Week A is everyone home; week B is the off week */
export const WEEK_LABEL = { A: 'Full house', B: 'Off week' } as const;

export type Day = (typeof DAYS)[number];

/*
 One week of a chore, keyed by day. A value is a person or, for a shared job,
 several. A day nobody is assigned is simply absent — hence Partial, which is
 what lets a Sunday-only chore be written `{ Sun: 'Ry' }` instead of six
 nulls around one name.

 Keying by day rather than by position means a chore can't silently shift a
 day by gaining or losing an entry, and a weekly job reads as `{ Sun: ... }`
 rather than something you have to count along to decode.
*/
export type Assignments = Partial<Record<Day, Person | Person[]>>;

export type Task = { name: string; note?: string; names: Person[] };

export type Chore = {
    name: string;
    note?: string;
    /* Week A is everyone home, week B the off week — see WEEK_LABEL. */
    A: Assignments;
    B: Assignments;
};

export const CHORES: Chore[] = [
    {
        name: 'Put away silverware',
        A: {
            Fri: 'Nathan',
            Sat: 'Nathan',
            Sun: 'Nathan',
            Mon: 'Nathan',
            Tue: 'Nathan',
            Wed: 'Nathan',
            Thu: 'Nathan',
        },
        B: {
            Fri: 'Nathan',
            Sat: 'Nathan',
            Sun: 'Nathan',
            Mon: 'Nathan',
            Tue: 'Nathan',
            Wed: 'Nathan',
            Thu: 'Nathan',
        },
    },
    {
        name: 'Wipe counters & table',
        A: {
            Fri: 'Sean',
            Sat: 'Jack',
            Sun: 'Sean',
            Mon: 'Jack',
            Tue: 'Sean',
            Wed: 'Jack',
            Thu: 'Sean',
        },
        B: {
            Fri: 'Nathan',
            Sat: 'Nathan',
            Sun: 'Nathan',
            Mon: 'Nathan',
            Tue: 'Nathan',
            Wed: 'Nathan',
            Thu: 'Nathan',
        },
    },
    {
        name: 'Check mail',
        A: {
            Fri: 'Nathan',
            Sat: 'Nathan',
            Sun: 'Nathan',
            Mon: 'Nathan',
            Tue: 'Nathan',
            Wed: 'Nathan',
            Thu: 'Nathan',
        },
        B: {
            Fri: 'Nathan',
            Sat: 'Nathan',
            Sun: 'Nathan',
            Mon: 'Nathan',
            Tue: 'Nathan',
            Wed: 'Nathan',
            Thu: 'Nathan',
        },
    },
    {
        name: 'Dog treats',
        A: {
            Fri: 'Brian',
            Sat: 'Heather',
            Sun: 'Brian',
            Mon: 'Heather',
            Tue: 'Brian',
            Wed: 'Heather',
            Thu: 'Brian',
        },
        B: {
            Fri: 'Brian',
            Sat: 'Heather',
            Sun: 'Brian',
            Mon: 'Heather',
            Tue: 'Brian',
            Wed: 'Heather',
            Thu: 'Brian',
        },
    },
    {
        name: 'Pick up clutter & toys',
        A: {
            Fri: ['Sean', 'Jack', 'Nathan'],
            Sat: ['Sean', 'Jack', 'Nathan'],
            Sun: ['Sean', 'Jack', 'Nathan'],
            Mon: ['Sean', 'Jack', 'Nathan'],
            Tue: ['Sean', 'Jack', 'Nathan'],
            Wed: ['Sean', 'Jack', 'Nathan'],
            Thu: ['Sean', 'Jack', 'Nathan'],
        },
        B: {
            Fri: 'Nathan',
            Sat: 'Nathan',
            Sun: 'Nathan',
            Mon: 'Nathan',
            Tue: 'Nathan',
            Wed: 'Nathan',
            Thu: 'Nathan',
        },
    },
    {
        name: 'Load dishwasher',
        A: {
            Fri: 'Ry',
            Sat: 'Brian',
            Sun: 'Heather',
            Mon: 'Ry',
            Tue: 'Heather',
            Wed: 'Brian',
            Thu: 'Heather',
        },
        B: {
            Fri: 'Brian',
            Sat: 'Heather',
            Sun: 'Brian',
            Mon: 'Heather',
            Tue: 'Brian',
            Wed: 'Heather',
            Thu: 'Brian',
        },
    },
    {
        name: 'Unload dishwasher',
        A: {
            Fri: 'Sean',
            Sat: 'Ry',
            Sun: 'Jack',
            Mon: 'Sean',
            Tue: 'Jack',
            Wed: 'Ry',
            Thu: 'Jack',
        },
        B: {
            Fri: 'Ry',
            Sat: 'Ry',
            Sun: 'Ry',
            Mon: 'Ry',
            Tue: 'Ry',
            Wed: 'Ry',
            Thu: 'Ry',
        },
    },
    {
        name: 'Trash',
        A: {
            Fri: 'Jack',
            Sat: 'Ry',
            Sun: 'Sean',
            Mon: 'Ry',
            Tue: 'Jack',
            Wed: 'Sean',
            Thu: 'Jack',
        },
        B: {
            Fri: 'Ry',
            Sat: 'Ry',
            Sun: 'Ry',
            Mon: 'Ry',
            Tue: 'Ry',
            Wed: 'Ry',
            Thu: 'Ry',
        },
    },
    {
        name: 'Bins to the street',
        note: 'night',
        A: { Mon: 'Jack' },
        B: { Mon: 'Ry' },
    },
    {
        name: 'Feed dog & cat',
        note: 'AM & PM',
        A: {
            Fri: 'Sean',
            Sat: 'Jack',
            Sun: 'Sean',
            Mon: 'Jack',
            Tue: 'Sean',
            Wed: 'Jack',
            Thu: 'Sean',
        },
        B: {
            Fri: 'Heather',
            Sat: 'Ry',
            Sun: 'Brian',
            Mon: 'Heather',
            Tue: 'Ry',
            Wed: 'Brian',
            Thu: 'Heather',
        },
    },
    {
        name: 'Litter box',
        A: { Mon: 'Ry', Thu: 'Brian' },
        B: { Mon: 'Ry', Thu: 'Heather' },
    },
    {
        name: 'Exercise dog',
        A: {
            Fri: 'Heather',
            Sat: 'Ry',
            Sun: 'Brian',
            Mon: 'Heather',
            Tue: 'Ry',
            Wed: 'Brian',
            Thu: 'Heather',
        },
        B: {
            Fri: 'Ry',
            Sat: 'Brian',
            Sun: 'Heather',
            Mon: 'Ry',
            Tue: 'Brian',
            Wed: 'Heather',
            Thu: 'Ry',
        },
    },
    {
        name: 'Clean microwave',
        A: { Fri: 'Sean' },
        B: { Fri: 'Heather' },
    },
    {
        name: 'Organize shoes',
        A: { Sun: 'Nathan' },
        B: { Sun: 'Nathan' },
    },
    {
        name: 'Vacuum common areas',
        A: { Sun: 'Brian' },
        B: { Sun: 'Brian' },
    },
    {
        name: 'Vacuum steps',
        A: { Sun: 'Heather' },
        B: { Sun: 'Heather' },
    },
    {
        name: 'Vacuum own room',
        A: { Sun: ['Brian', 'Heather', 'Ry', 'Sean', 'Jack', 'Nathan'] },
        B: { Sun: ['Brian', 'Heather', 'Ry', 'Nathan'] },
    },
    {
        name: "Mom & Dad's bath",
        A: { Sun: 'Heather' },
        B: { Sun: 'Brian' },
    },
    {
        name: "Ry's bath",
        A: { Sun: 'Ry' },
        B: { Sun: 'Ry' },
    },
    {
        name: "Boys' bath",
        A: { Sun: 'Brian' },
        B: { Sun: 'Heather' },
    },
    {
        name: 'Change bed linens',
        A: { Sun: ['Brian', 'Heather', 'Ry', 'Sean', 'Jack', 'Nathan'] },
        B: {},
    },
    {
        name: "Scrub tub - Ry's bath",
        note: '1st wknd',
        A: { Sun: 'Ry' },
        B: {},
    },
    {
        name: "Scrub tub - boys' bath",
        note: '1st wknd',
        A: { Sun: ['Sean', 'Jack'] },
        B: {},
    },
    {
        name: 'Dust upstairs',
        note: '1st wknd',
        A: { Sun: 'Sean' },
        B: {},
    },
    {
        name: 'Dust downstairs',
        note: '1st wknd',
        A: { Sun: 'Jack' },
        B: {},
    },
];
