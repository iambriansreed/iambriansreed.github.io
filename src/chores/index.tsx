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
        <li class="task" data-people={names.join(' ')}>
            {/* The row is the control, so it has to be a real button: a click
                handler on the <li> alone is unreachable by keyboard and
                announces nothing. role=checkbox because it toggles, and the
                button element carries the Enter/Space handling for free.
                Children are all spans — <div> is not valid inside a button. */}
            <button
                class="task-btn"
                type="button"
                role="checkbox"
                aria-checked="false"
            >
                <span class="check">
                    <CheckIcon />
                </span>
                <span class="task-body">
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
                </span>
            </button>
        </li>
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
                Tap a task to check it off. Week flips every other Friday.
                <div id="datepick">
                    <label for="pickdate">Jump to a date</label>
                    <input type="date" id="pickdate" />
                    <button id="picktoday" type="button">
                        Today
                    </button>
                </div>
            </footer>

            <script src="./client.ts"></script>
        </>
    );
}
