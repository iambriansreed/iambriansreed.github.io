import {
    type Task,
    CHORES,
    DAYS,
    DAY_NAMES,
    ORDER,
    PEOPLE,
    WEEK_LABEL,
    type Person,
} from './data';
import { getApiOriginScript } from '../utils';

/* ---------- Week logic ---------- */
/* Week A started Friday July 3, 2026. Cycle length 14 days. */
const WEEK_A_START = new Date(2026, 6, 3); // month 6 = July
WEEK_A_START.setHours(0, 0, 0, 0);

function getCurrentWeek(): 'A' | 'B' {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysSinceStart = Math.floor(
        (today.getTime() - WEEK_A_START.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysSinceStart % 14 < 7 ? 'A' : 'B';
}

/* Local YYYY-MM-DD. Deliberately not toISOString(): that converts to UTC and
   would hand the client the wrong start date west of Greenwich. */
function isoDate(d: Date) {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/* ---------- Chart -> markup ---------- */
/* The 14-day cycle is week A's seven columns followed by week B's, so a cycle
   day indexes straight into the chart — no calendar math needed to render. */

function assignmentsFor(cycleDay: number): Task[] {
    const week: 'A' | 'B' = cycleDay < 7 ? 'A' : 'B';
    const day = DAYS[cycleDay % 7];
    const out: Task[] = [];
    for (const chore of CHORES) {
        // "1st wknd" chores need no special case: they carry a Sun key in week
        // A and nothing else, so this lookup already confines them to cycle
        // day 2. An unassigned day is an absent key, so undefined means skip.
        const who = chore[week][day];
        if (!who) continue;
        out.push({
            name: chore.name,
            note: chore.note,
            names: Array.isArray(who) ? who : [who],
        });
    }
    return out;
}

const CheckIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <polyline points="4 12 10 18 20 5" />
    </svg>
);

/* Both are rendered and CSS shows one, the way the theme toggle does — swapping
   an icon by rebuilding SVG in the client would be a lot of DOM for one bit.
   The bit they carry is whether anyone is on record for the chore, which is the
   one thing the row's check does not already say. */
const WhoPlusIcon = () => (
    <svg class="icon-who-plus" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
);

const WhoCheckIcon = () => (
    <svg class="icon-who-check" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="17 11 19 13 23 9" />
    </svg>
);

function PersonChip({ person }: { person: Person | null }) {
    return (
        <button
            class="chip"
            type="button"
            aria-pressed={person ? 'false' : 'true'}
            data-person={person ?? ''}
            style={{
                '--person': person ? PEOPLE[person].color : 'var(--ink-soft)',
            }}
        >
            {person && <span class="dot"></span>}
            {person ?? 'Everyone'}
        </button>
    );
}

function Task({ name, note, names }: Task) {
    return (
        // data-people is space-separated so the filter can match it with [~=].
        // data-chore is the name the API stores check-offs under, so it has to
        // be the chore's own name rather than its position in the day's list —
        // adding a chore above another must not move the other one's history.
        <li class="task" data-chore={name} data-people={names.join(' ')}>
            {/* The only control that completes a chore. A real button so it is
                reachable by keyboard and announces itself; role=checkbox
                because it toggles. Its tap target is widened well past the
                visible box by .task-check::before — see style.css. */}
            <button
                class="task-check"
                type="button"
                role="checkbox"
                aria-checked="false"
                aria-label={`Mark ${name} done`}
            >
                <span class="check">
                    <CheckIcon />
                </span>
            </button>

            {/* Plain markup now that it is no longer inside a button, so the
                names can be a real list rather than a run of spans. */}
            <div class="task-body">
                <span class="task-name">
                    {name}
                    {note && <span class="badge-note">{note}</span>}
                </span>
                {names.map((n) => (
                    <span
                        class="task-who"
                        style={{ '--person': PEOPLE[n].color }}
                    >
                        <span class="dot"></span>
                        {n}
                    </span>
                ))}
            </div>

            <button
                class="task-action"
                type="button"
                aria-label={`Choose who did ${name}`}
            >
                <WhoPlusIcon />
                <WhoCheckIcon />
            </button>
        </li>
    );
}

/**
 * The who-did-it picker, rendered once and pointed at whichever chore was
 * tapped. Every household member is listed, not just the day's assignees — the
 * whole reason to open this is that someone else stepped in.
 *
 * Its button completes the chore as well as recording the names, so the modal
 * is a way to finish a chore rather than a second step after finishing it.
 */
function WhoDialog() {
    return (
        <dialog id="whodid" class="who" aria-labelledby="who-title">
            <h2 class="who-title" id="who-title">
                Who did it?
            </h2>
            <p class="who-chore" id="who-chore"></p>
            {/* Says whether the ticks below are a record or the chart's guess,
                so accepting them is a decision rather than a rubber stamp. */}
            <p class="who-hint" id="who-hint"></p>
            <ul class="who-list">
                {ORDER.map((person) => (
                    <li>
                        <label
                            class="who-option"
                            style={{ '--person': PEOPLE[person].color }}
                        >
                            <input type="checkbox" name="who" value={person} />
                            <span class="dot"></span>
                            <span class="who-name">{person}</span>
                        </label>
                    </li>
                ))}
            </ul>
            <div class="who-actions">
                <button type="button" class="who-cancel" id="who-cancel">
                    Cancel
                </button>
                <button type="button" class="who-complete" id="who-complete">
                    Complete
                </button>
            </div>
        </dialog>
    );
}

function DayCard({ cycleDay }: { cycleDay: number }) {
    const col = cycleDay % 7;
    const tasks = assignmentsFor(cycleDay);

    // data-cycle-day is how the client finds today's and tomorrow's cards.
    return (
        <section class="day" data-cycle-day={cycleDay}>
            <div class="day-head">
                <div class="day-title">
                    <span class="day-when">{DAY_NAMES[col]}</span>
                    <span class="day-date"></span>
                </div>
                <span class="count">
                    {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                </span>
            </div>
            {tasks.length === 0 ? (
                <div class="empty">Nothing on the chart.</div>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <Task {...task} />
                    ))}
                </ul>
            )}
        </section>
    );
}

export function Page(): Skrapa.Page {
    const currentWeek = getCurrentWeek();

    return (
        <>
            <header>
                <div class="brand">
                    <h1>House Chores</h1>
                    <span id="weektag" class="weektag">
                        Week {currentWeek}
                    </span>
                </div>
                <div id="datebar" class="datebar"></div>
            </header>

            <div class="filter">
                <div
                    id="filterScroll"
                    class="filter-scroll"
                    role="group"
                    aria-label="Filter by person"
                >
                    <PersonChip person={null} />
                    {ORDER.map((person) => (
                        <PersonChip person={person} />
                    ))}
                </div>
            </div>

            {/* Every day of the cycle is rendered up front; the client only has
                to reveal today and tomorrow and stamp the calendar dates on. */}
            <main id="main" data-cycle-start={isoDate(WEEK_A_START)}>
                {(['A', 'B'] as const).map((week) => (
                    <div
                        class="week"
                        data-week={week}
                        data-current={week === currentWeek ? 'true' : 'false'}
                    >
                        <h2 class="week-head">
                            Week {week} <span class="dot-sep">·</span>{' '}
                            {WEEK_LABEL[week]}
                        </h2>
                        {DAYS.map((_, col) => (
                            <DayCard cycleDay={week === 'A' ? col : col + 7} />
                        ))}
                    </div>
                ))}
            </main>
            <footer>
                Tap the circle to check a chore off, or the person to say who
                did it. Week flips every other Friday.
                <div id="datepick">
                    <label for="pickdate">Jump to a date</label>
                    <input type="date" id="pickdate" />
                    <button id="picktoday" type="button">
                        Today
                    </button>
                </div>
            </footer>

            <WhoDialog />

            {/* Where the confetti bits are appended. Fixed and full-bleed, so it
                has to sit outside the cards it fires over. */}
            <div class="confetti-layer" id="confetti" aria-hidden="true"></div>
            <script>{getApiOriginScript()}</script>
            <script src="./client.ts"></script>
        </>
    );
}
