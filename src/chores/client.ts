/*
 Chores client.

 Every day of the 14-day cycle is already in the DOM — index.tsx renders the
 whole chart at build time. None of the chart data ships to the browser: this
 picks today and tomorrow out of what is already there, labels them with real
 dates, and handles the person filter and check-offs.

 Wrapped in an IIFE because skrapa compiles each client.ts as a global script,
 so top-level names here would collide with the page module's own constants.
*/
(() => {
    const qs = <T extends Element = HTMLElement>(
        s: string,
        parentNode?: ParentNode,
    ) => (parentNode || document).querySelector<T>(s) as T;
    const qsa = <T extends Element = HTMLElement>(
        s: string,
        parentNode?: ParentNode,
    ) => Array.from((parentNode || document).querySelectorAll<T>(s)) as T[];

    const DAY_MS = 86400000;
    const CYCLE_LENGTH = 14;

    const main = qs('#main');
    const weekTag = qs('#weektag');
    const dateBar = qs('#datebar');
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
    /* "2026-08-05#3" -> checked. In memory only; a reload starts fresh. */
    const done = new Set<string>();

    /* The styling hangs off the <li>, the state off the button. Both move
       together here so a check-off can never look done without saying so. */
    function setDone(task: HTMLElement, isDone: boolean) {
        task.classList.toggle('done', isDone);
        qs('.task-btn', task)?.setAttribute('aria-checked', String(isDone));
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

        qs('.day-head', card).classList.toggle('today', isToday);
        qs('.day-when', card).textContent =
            `${isToday ? 'Today' : 'Tomorrow'} · ${fmt(date, { weekday: 'short' })}`;
        qs('.day-date', card).textContent = fmt(date, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });

        const stamp = toDateInput(date);
        let visible = 0;
        qsa('li.task', card).forEach((task, i) => {
            const people = (task.dataset.people ?? '').split(' ');
            const hidden = !!activePerson && !people.includes(activePerson);
            task.classList.toggle('is-hidden', hidden);
            if (!hidden) visible += 1;

            // Keyed by index: a cycle day's task list never changes.
            const key = `${stamp}#${i}`;
            task.dataset.doneKey = key;
            setDone(task, done.has(key));
        });

        qs('.count', card).textContent =
            `${visible} ${visible === 1 ? 'task' : 'tasks'}`;
        setEmptyState(card, visible === 0);
    }

    function render() {
        const today = startOfDay(dateOverride ?? new Date());
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

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

    chips.forEach((chip) =>
        chip.addEventListener('click', () => {
            activePerson = chip.dataset.person || null;
            render();
        }),
    );

    main.addEventListener('click', (event) => {
        const btn = (event.target as HTMLElement).closest<HTMLElement>(
            '.task-btn',
        );
        const task = btn?.closest<HTMLElement>('li.task');
        const key = task?.dataset.doneKey;
        if (!task || !key) return;
        if (done.has(key)) done.delete(key);
        else done.add(key);
        setDone(task, done.has(key));
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
        });
        pickToday.addEventListener('click', () => {
            dateOverride = null;
            pickInput.value = toDateInput(new Date());
            render();
        });
    }

    render();
})();
