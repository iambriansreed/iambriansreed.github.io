/*
 Chores client.

 Every day of the 14-day cycle is already in the DOM — index.tsx renders the
 whole chart at build time. None of the chart data ships to the browser: this
 picks today and tomorrow out of what is already there, labels them with real
 dates, and handles the person filter and check-offs.

 Wrapped in an IIFE because skrapa compiles each client.ts as a global script,
 so top-level names here would collide with the page module's own constants.
*/

/* The /chores client, generated from the API's OpenAPI spec. Do not edit api.ts
   by hand — run `npm run generate` in the api repo and it is rewritten in place.

   A value import, unlike the shared-types package this replaced: skrapa resolves
   this file's import graph into the page's standalone script, so the functions
   are bundled along with the types. */
import {
    configure,
    list,
    upsert,
    type ChoreStateResponse,
    type UpsertChoreInput,
} from './api';

(() => {
    const qs = <T extends Element = HTMLElement>(
        s: string,
        parentNode?: ParentNode,
    ) => (parentNode || document).querySelector<T>(s);
    const qsa = <T extends Element = HTMLElement>(
        s: string,
        parentNode?: ParentNode,
    ) => Array.from((parentNode || document).querySelectorAll<T>(s)) as T[];

    /* For the elements index.tsx always renders. A miss is a build bug, not a
       runtime condition, so this throws naming the selector rather than letting
       a TypeError surface somewhere unrelated later. Throwing here is also the
       designed failure mode: the whole two-week chart is already in the DOM and
       stays readable, since it is only collapsed to the two-day view at the end
       of render(). */
    const must = <T extends Element = HTMLElement>(
        s: string,
        parentNode?: ParentNode,
    ): T => {
        const el = (parentNode || document).querySelector<T>(s);
        if (!el) throw new Error(`chores: no element matches ${s}`);
        return el;
    };

    const DAY_MS = 86400000;
    const CYCLE_LENGTH = 14;

    const main = must('#main');
    const weekTag = must('#weektag');
    const dateBar = must('#datebar');
    const chips = qsa<HTMLButtonElement>('.chip');
    const cards = qsa('.day', main);

    /* Local midnight. `new Date("2026-07-03")` parses as UTC and lands on the
       2nd anywhere west of Greenwich. */
    function parseLocalDate(value: string) {
        const [y, m, d] = value.split('-').map(Number);
        return new Date(y, m - 1, d);
    }
    /* Inverse, for <input type="date"> — same reason to avoid toISOString(). */
    function toDateInput(d: Date) {
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }
    const startOfDay = (d: Date) =>
        new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const CYCLE_START = parseLocalDate(main.dataset.cycleStart!);

    /* Where a date sits in the A/B cycle (0..13). Both ends are local midnight
       and the quotient is rounded, so a DST shift inside the span can't knock
       the result a day short. */
    function cycleDayFor(date: Date) {
        const diff = Math.round(
            (startOfDay(date).getTime() - CYCLE_START.getTime()) / DAY_MS,
        );
        return ((diff % CYCLE_LENGTH) + CYCLE_LENGTH) % CYCLE_LENGTH;
    }

    const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
        d.toLocaleDateString('en-US', opts);
    const SHORT_DATE: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
    };

    let activePerson: string | null = null;
    let dateOverride: Date | null = null;
    /* The two days on screen, as YYYY-MM-DD — what refresh() pulls state for. */
    let visibleDates: string[] = [];

    const REDUCE_MOTION = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
    ).matches;

    /* ---------- Check-off state ---------- */
    /*
     Keyed `date|chore`, the same pair the API keys its rows by. A chore shared by
     several people is one job the household does together, so it is one entry that
     anyone on it can tick — not one per assignee that only counted as done once
     all of them agreed.

     `people` is who actually did it, which is not the same as who the chart had
     on it: the roster is the default, and the picker is there for the day someone
     else stepped in.

     A missing entry means nobody has touched it. An explicit `checked: false` —
     which is what the API returns for something ticked and then unticked — is
     stored rather than dropped, so a check-off undone on another phone can't be
     out-voted by a stale local tick.
    */
    type ChoreState = { checked: boolean; people: string[] };
    const state = new Map<string, ChoreState>();
    const keyFor = (date: string, chore: string) => `${date}|${chore}`;

    /* Injected by index.tsx in a <script> just above this one. The generated
       client defaults to production, so point it at whatever this build targets. */
    const { API_ORIGIN } = window;
    configure({ baseUrl: API_ORIGIN });

    /* Who the chart has on the chore — the build-time roster, not who did it. */
    const peopleOf = (task: HTMLElement) =>
        (task.dataset.people ?? '').split(' ').filter(Boolean);

    /* Both halves of the key are on the element: data-chore is baked in at build
       time, data-date stamped on by showDay when the card is revealed. */
    const stateOf = (task: HTMLElement): ChoreState | undefined => {
        const { chore, date } = task.dataset;
        return chore && date ? state.get(keyFor(date, chore)) : undefined;
    };

    const isTaskDone = (task: HTMLElement) => stateOf(task)?.checked === true;

    /* The styling hangs off the <li>, the state off the check button. Both move
       together here so a check-off can never look done without saying so.
       `attributed` drives the icon swap on the who-did-it button. */
    function paintTask(task: HTMLElement) {
        const current = stateOf(task);
        const isDone = current?.checked === true;

        task.classList.toggle('done', isDone);
        task.classList.toggle(
            'attributed',
            isDone && (current?.people.length ?? 0) > 0,
        );
        qs('.task-check', task)?.setAttribute('aria-checked', String(isDone));
    }

    /* The chart never has a genuinely empty day, but filtering to one person
       can empty a card, so the placeholder is built on demand. */
    function setEmptyState(card: HTMLElement, isEmpty: boolean) {
        // A card with no tasks at all is rendered without a <ul>, so this is
        // optional even though today's chart always has one.
        const list = qs('ul', card);
        if (list) list.hidden = isEmpty;

        let empty = qs('.empty', card);
        if (!isEmpty) {
            if (empty) empty.hidden = true;
            return;
        }
        if (!empty) {
            empty = document.createElement('div');
            empty.className = 'empty';
            card.appendChild(empty);
        }
        empty.hidden = false;
        const who = document.createElement('strong');
        who.textContent = activePerson ?? 'Nobody';
        empty.replaceChildren(who, ' has nothing assigned.');
    }

    /* Reveal one pre-rendered card as today or tomorrow. `order` places it,
       since the cycle wraps and tomorrow can sit earlier in the document. */
    function showDay(date: Date, order: number, isToday: boolean) {
        const card = qs(`.day[data-cycle-day="${cycleDayFor(date)}"]`, main);
        if (!card) return;

        card.dataset.show = '';
        card.style.order = String(order);

        must('.day-head', card).classList.toggle('today', isToday);
        must('.day-when', card).textContent =
            `${isToday ? 'Today' : 'Tomorrow'} · ${fmt(date, { weekday: 'short' })}`;
        must('.day-date', card).textContent = fmt(date, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });

        const stamp = toDateInput(date);
        let visible = 0;
        qsa('li.task', card).forEach((task) => {
            const people = peopleOf(task);
            const hidden = !!activePerson && !people.includes(activePerson);
            task.classList.toggle('is-hidden', hidden);
            if (!hidden) visible += 1;

            // The card is one of the 14 pre-rendered cycle days, reused every
            // fortnight, so the calendar date it currently stands for has to be
            // stamped on — it is half of the key a check-off is stored under.
            task.dataset.date = stamp;
            paintTask(task);
        });

        must('.count', card).textContent =
            `${visible} ${visible === 1 ? 'task' : 'tasks'}`;
        setEmptyState(card, visible === 0);
    }

    function render() {
        const today = startOfDay(dateOverride ?? new Date());
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        visibleDates = [toDateInput(today), toDateInput(tomorrow)];

        const letter = cycleDayFor(today) < 7 ? 'A' : 'B';
        qsa('.week', main).forEach((week) => {
            week.dataset.current = String(week.dataset.week === letter);
        });

        // The heading is already rendered ("Week A · Full house"), so the tag
        // reuses it rather than restating those labels here.
        const head = qs(`.week[data-week="${letter}"] .week-head`, main);
        weekTag.textContent = head?.textContent?.trim() ?? `Week ${letter}`;
        weekTag.className = letter === 'B' ? 'weektag b' : 'weektag';

        dateBar.textContent = `${fmt(today, SHORT_DATE)}  →  ${fmt(
            tomorrow,
            SHORT_DATE,
        )}`;

        chips.forEach((chip) => {
            const person = chip.dataset.person || null;
            chip.setAttribute('aria-pressed', String(person === activePerson));
        });

        cards.forEach((card) => {
            delete card.dataset.show;
            card.style.order = '';
        });
        showDay(today, 0, true);
        showDay(tomorrow, 1, false);

        // Collapses the chart down to the two days. Set last so the page still
        // reads as a complete two-week chart if this script never runs.
        main.dataset.view = 'pair';
    }

    /* ---------- Failure notice ---------- */
    /* Built on demand, so nothing is added to the page unless a write or a load
       actually fails. role=status announces it without stealing focus. */
    let toastEl: HTMLElement | undefined;
    let toastTimer: ReturnType<typeof setTimeout> | undefined;

    function toast(text: string) {
        const created = !toastEl;
        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.className = 'toast';
            toastEl.setAttribute('role', 'status');
            document.body.appendChild(toastEl);
        }
        const el = toastEl;

        const show = () => {
            el.textContent = text;
            el.dataset.show = '';
            clearTimeout(toastTimer);
            toastTimer = setTimeout(() => delete el.dataset.show, 3200);
        };

        /* A live region is only watched for changes made after it joins the
           accessibility tree, so filling one in the same task that appended it
           announces nothing. Only the first message pays the extra tick. */
        if (created) setTimeout(show, 0);
        else show();
    }

    /* ---------- Confetti ---------- */
    /*
     The Splendor board's game-over cannons, ported from React to this script
     (games/src/client/components/splendor/SplendorBoard.tsx). Spurts fire inward
     from points spread along the bottom and lower sides; each bit is a small div
     thrown along an arc by the Web Animations API and removed when it lands.
     Nothing runs at all under reduced motion.
    */
    const CONFETTI_COLORS = [
        '#e0413b',
        '#e98c2e',
        '#e9c83a',
        '#4f9d6b',
        '#5a8fd6',
        '#9b59c6',
        '#f2f0ea',
    ];
    /* Ticking several chores in a row overlaps volleys. One volley is ~270 bits,
       which is fine; four at once is not, so appending stops above this and the
       bits already flying finish on their own. */
    const CONFETTI_MAX_BITS = 700;

    function fireConfetti() {
        if (REDUCE_MOTION) return;
        const host = qs('#confetti');
        if (!host) return;

        const W = window.innerWidth;
        const H = window.innerHeight;
        const off = 70; // how far past the edge a spurt starts
        const sideH = H * 0.5; // active height of each side (lower half)
        const perimeter = sideH + W + sideH;

        /* One spurt: a cone fired inward from a point at fraction `t` along the
           lower perimeter — left side (lower half) → bottom → right side. */
        const spurt = (count: number, t: number) => {
            const d = t * perimeter;
            let ox: number;
            let oy: number;
            let inward: number; // +1 to fly right, -1 to fly left

            if (d < sideH) {
                ox = -off;
                oy = H - 30 - (d / sideH) * sideH;
                inward = 1;
            } else if (d < sideH + W) {
                ox = d - sideH;
                oy = H + off;
                inward = ox < W / 2 ? 1 : -1;
            } else {
                ox = W + off;
                oy = H - 30 - sideH + ((d - sideH - W) / sideH) * sideH;
                inward = -1;
            }

            for (let i = 0; i < count; i++) {
                if (host.childElementCount >= CONFETTI_MAX_BITS) return;

                const bit = document.createElement('div');
                bit.className = 'confetti-bit';
                const w = 5 + Math.random() * 8;
                bit.style.width = `${w}px`;
                bit.style.height = `${Math.max(4, w * (0.4 + Math.random() * 0.6))}px`;
                bit.style.background =
                    CONFETTI_COLORS[
                        (Math.random() * CONFETTI_COLORS.length) | 0
                    ];
                bit.style.left = `${ox}px`;
                bit.style.top = `${oy}px`;
                host.appendChild(bit);

                // Burst inward and up fast, crest early, then flutter down and
                // exit past the bottom wherever it launched from.
                const reach = W * (0.12 + Math.random() * 0.5);
                const dx = inward * reach + (Math.random() - 0.5) * W * 0.14;
                const apexX = dx * (0.45 + Math.random() * 0.3);
                const apex = -Math.min(
                    H * 0.16 + Math.random() * H * 0.4,
                    oy - 30,
                );
                const fall = H + 120 - oy + Math.random() * H * 0.25;
                const spin =
                    (Math.random() < 0.5 ? -1 : 1) *
                    (180 + Math.random() * 900);
                const sway =
                    (Math.random() < 0.5 ? -1 : 1) * (16 + Math.random() * 48);
                const crest = 0.12 + Math.random() * 0.06;
                const dur = 4200 + Math.random() * 3000;
                const lerpX = (at: number) => apexX + (dx - apexX) * at;

                const anim = bit.animate(
                    [
                        {
                            transform: 'translate(0px, 0px) rotate(0deg)',
                            opacity: 1,
                            offset: 0,
                            easing: 'cubic-bezier(0.1, 0.75, 0.3, 1)',
                        },
                        {
                            transform: `translate(${apexX}px, ${apex}px) rotate(${spin * 0.18}deg)`,
                            opacity: 1,
                            offset: crest,
                            easing: 'ease-in-out',
                        },
                        {
                            transform: `translate(${lerpX(0.4) + sway}px, ${apex + (fall - apex) * 0.4}px) rotate(${spin * 0.45}deg)`,
                            opacity: 1,
                            offset: crest + (1 - crest) * 0.4,
                            easing: 'ease-in-out',
                        },
                        {
                            transform: `translate(${lerpX(0.72) - sway}px, ${apex + (fall - apex) * 0.72}px) rotate(${spin * 0.75}deg)`,
                            opacity: 1,
                            offset: crest + (1 - crest) * 0.72,
                            easing: 'ease-in-out',
                        },
                        {
                            transform: `translate(${dx}px, ${fall}px) rotate(${spin}deg)`,
                            opacity: 0,
                            offset: 1,
                        },
                    ],
                    {
                        duration: dur,
                        delay: Math.random() * 260,
                        fill: 'forwards',
                    },
                );
                anim.onfinish = () => bit.remove();
            }
        };

        // Spurts spread evenly along the perimeter (one per stratified slice,
        // jittered within it) and fired in shuffled order over ~2s, so the
        // even spread doesn't read as a predictable sweep.
        const SPURTS = 6;
        const slices = Array.from(
            { length: SPURTS },
            (_, k) => (k + Math.random()) / SPURTS,
        );
        for (let k = slices.length - 1; k > 0; k--) {
            const j = (Math.random() * (k + 1)) | 0;
            [slices[k], slices[j]] = [slices[j], slices[k]];
        }
        slices.forEach((t, k) => {
            setTimeout(
                () => spurt(45 + ((Math.random() * 35) | 0), t),
                k * 360,
            );
        });
    }

    /* ---------- Persistence ---------- */

    /* A write has to settle fast enough that the confetti still reads as the
       answer to the tap, so this doubles as the deadline for celebrating: past
       it the tick is rolled back and the failure notice takes its place. A
       write that does reach the API after we gave up is put right by the next
       refresh, which is what makes giving up this early safe. */
    const WRITE_TIMEOUT_MS = 2_500;
    /* Longer, because nothing is waiting on a read the way the confetti waits
       on a write. Only here so a pull cannot hang forever. */
    const READ_TIMEOUT_MS = 8_000;

    /* The generated client throws on any non-2xx, so the status check the hand-
       written fetch needed is gone; `init` is where the timeout goes. */
    function fetchDate(date: string): Promise<ChoreStateResponse[]> {
        return list({ date }, { signal: AbortSignal.timeout(READ_TIMEOUT_MS) });
    }

    /* Chores with a write in flight, keyed the same way as the state above, so a
       double-tap cannot race two opposite writes into the API in an undefined
       order, and so a reply that left before the write cannot land on top of
       it below. */
    const saving = new Set<string>();

    /* Monotonic tick, and the tick each chore was last written at.
       `saving` on its own cannot settle this race, because it is read when the
       GET resolves rather than when it was issued: a write that started after
       the GET left and finished before the reply landed has already cleared its
       key, so the pre-write row wins and the next tap — reading the row as off
       — turns the saved check-off back off. The stamp outlives the write, so
       comparing it against the tick the GET was issued at catches that too. */
    let writeTick = 0;
    const lastWrite = new Map<string, number>();

    /* Pulls state for the days on screen and repaints. The reply is the whole
       truth for a date, so its rows replace everything held for that date rather
       than merging into it — otherwise a check-off undone elsewhere would linger
       here forever.

       A chore written since the GET was issued is the exception: the tap is
       newer than anything the reply can carry, so it keeps its local state and
       the POST is what settles it.

       `notify` is off for the background pulls at load and on wake: the chart is
       pre-rendered and readable without them, so a phone with no signal should
       not be told so every time it is picked up. A pull the user asked for says
       when it fails. */
    async function refresh({ notify = false } = {}) {
        if (visibleDates.length === 0) return;
        const dates = visibleDates;
        const issuedAt = writeTick;

        const outrunsReply = (key: string) =>
            saving.has(key) || (lastWrite.get(key) ?? 0) > issuedAt;

        try {
            const rows = (await Promise.all(dates.map(fetchDate))).flat();

            for (const date of dates) {
                for (const key of [...state.keys()]) {
                    if (key.startsWith(`${date}|`) && !outrunsReply(key))
                        state.delete(key);
                }
            }
            for (const row of rows) {
                const key = keyFor(row.date, row.choreName);
                if (!outrunsReply(key))
                    state.set(key, {
                        checked: row.checked,
                        // The spec types `people` as required, but a row that
                        // arrives without it would make `current?.people.length`
                        // throw in paintTask — which refresh()'s catch swallows,
                        // so the chart would just stop updating with no error.
                        people: row.people ?? [],
                    });
            }

            render();
        } catch (err) {
            console.error('chores refresh failed', err);
            if (notify) toast('Could not load the latest check-offs.');
        }
    }

    async function postCheck(row: UpsertChoreInput) {
        await upsert(row, { signal: AbortSignal.timeout(WRITE_TIMEOUT_MS) });
    }

    /* One write per completion, carrying who did it — which only the picker
       knows, so the check button passes nothing. Un-completing clears the names
       either way: nobody did a chore that isn't done.

       `people` is not part of the key, so a chore that changes hands keeps its
       history. The tick is applied locally first and rolled back only if the
       write fails, so a tap stays instant on a phone with bad signal. */
    async function saveTask(
        task: HTMLElement,
        isDone: boolean,
        people: string[],
    ) {
        const { chore, date } = task.dataset;
        if (!chore || !date) return;

        const key = keyFor(date, chore);
        const previous = state.get(key);
        const next: ChoreState = {
            checked: isDone,
            people: isDone ? people : [],
        };

        state.set(key, next);
        paintTask(task);

        saving.add(key);
        lastWrite.set(key, ++writeTick);
        try {
            await postCheck({
                choreName: chore,
                date,
                people: next.people,
                checked: isDone,
            });

            /* Only once the write is known to have landed. The tick stays
               optimistic so the row answers the tap instantly, but the
               celebration is the one bit of feedback that should not be
               retracted — and WRITE_TIMEOUT_MS caps the wait, so it is either
               prompt or replaced by the failure notice below. */
            if (isDone) fireConfetti();
        } catch (err) {
            console.error('chores save failed', err);
            if (previous === undefined) state.delete(key);
            else state.set(key, previous);
            paintTask(task);
            toast("Couldn't save that one. Tap it again.");
        } finally {
            saving.delete(key);
        }
    }

    chips.forEach((chip) =>
        chip.addEventListener('click', () => {
            activePerson = chip.dataset.person || null;
            render();
        }),
    );

    /* ---------- Who did it ---------- */
    const whoDialog = must<HTMLDialogElement>('#whodid');
    const whoChore = must('#who-chore');
    const whoHint = must('#who-hint');
    const whoBoxes = qsa<HTMLInputElement>('input[name="who"]', whoDialog);
    /* Which row the open picker is editing. Held rather than re-found on
       Complete: the filter or a refresh could re-render between the two. */
    let whoTask: HTMLElement | null = null;

    function openWho(task: HTMLElement) {
        const { chore } = task.dataset;
        if (!chore) return;

        whoTask = task;
        whoChore.textContent = chore;

        /* Start from who is already on record, falling back to the day's roster
           — the common correction is dropping one name from it, not building
           the list up from nothing.

           The roster is a guess, which is exactly what the check button refuses
           to record on its own. The difference that makes it fair here is that
           you see it before you confirm it, so the hint says which of the two
           you are looking at. */
        const current = stateOf(task);
        const onRecord = current?.people.length ? current.people : null;
        const preset = onRecord ?? peopleOf(task);

        whoHint.textContent = onRecord
            ? 'Already recorded for this chore.'
            : 'Who the chart has today. Change it if someone else stepped in.';

        whoBoxes.forEach((box) => {
            box.checked = preset.includes(box.value);
        });

        whoDialog.showModal();
    }

    must('#who-cancel').addEventListener('click', () => whoDialog.close());

    /* Completes the chore as well as recording the names — the picker is a way
       to finish a chore, not a second step after finishing one. */
    must('#who-complete').addEventListener('click', () => {
        const task = whoTask;
        whoDialog.close();
        if (!task) return;

        const { chore, date } = task.dataset;
        if (!chore || !date || saving.has(keyFor(date, chore))) return;

        void saveTask(
            task,
            true,
            whoBoxes.filter((box) => box.checked).map((box) => box.value),
        );
    });

    whoDialog.addEventListener('close', () => {
        whoTask = null;
    });

    main.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const task = target.closest<HTMLElement>('li.task');
        if (!task) return;

        if (target.closest('.task-action')) {
            openWho(task);
            return;
        }

        // Only the check completes a chore; a tap anywhere else on the row does
        // nothing, so a name or a note can be read without toggling it.
        if (!target.closest('.task-check')) return;

        const { chore, date } = task.dataset;
        if (!chore || !date) return;
        if (saving.has(keyFor(date, chore))) return;

        // No names: the check says the job is done, not who did it. Recording
        // the day's roster here would have been a guess, and one that made every
        // ticked chore look attributed — which is the whole bit the who-did-it
        // icon carries. Naming somebody is what the picker is for.
        void saveTask(task, !isTaskDone(task), []);
    });

    /* ---------- Date picker ---------- */
    const pickInput = qs<HTMLInputElement>('#pickdate');
    const pickToday = qs('#picktoday');
    if (pickInput && pickToday) {
        pickInput.value = toDateInput(new Date());
        pickInput.addEventListener('change', () => {
            dateOverride = pickInput.value
                ? parseLocalDate(pickInput.value)
                : null;
            render();
            void refresh({ notify: true });
        });
        pickToday.addEventListener('click', () => {
            dateOverride = null;
            pickInput.value = toDateInput(new Date());
            render();
            void refresh({ notify: true });
        });
    }

    /* ---------- Coming back to the page ---------- */
    /* A phone that wakes up should be showing the current chart, so state is
       pulled again whenever the page returns to the foreground. focus and
       visibilitychange both fire on the same wake, hence the coalescing delay. */
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;

    function scheduleRefresh() {
        if (document.visibilityState === 'hidden') return;
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => void refresh(), 120);
    }

    document.addEventListener('visibilitychange', scheduleRefresh);
    window.addEventListener('focus', scheduleRefresh);

    // Paint the chart from the pre-rendered DOM first, then fill in the saved
    // check-offs — the page is usable before the network answers.
    render();
    void refresh();
})();
