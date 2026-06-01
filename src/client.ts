/// <reference path="../global.d.ts" />

const qs = <T extends Element = HTMLElement>(
    s: string,
    parentNode?: ParentNode,
) => (parentNode || document).querySelector<T>(s) as T;
const qsa = <T extends Element = HTMLElement>(
    s: string,
    parentNode?: ParentNode,
) => Array.from((parentNode || document).querySelectorAll<T>(s)) as T[];

const ACCENTS = [
    '#7a8a3a',
    '#5a8a6a',
    '#4a7fa5',
    '#c97a3a',
    '#b5542a',
    '#b56070',
    '#7a5a9a',
    '#3a8a8a',
];

const html = document.documentElement;
const themeBtn = qs<HTMLButtonElement>('.theme-toggle')!;
const accentBtn = qs<HTMLButtonElement>('.accent-toggle')!;
const cookieBar = qs<HTMLDialogElement>('#cookie-bar')!;
const cookieConsentBtns = qsa<HTMLButtonElement>('.consent-btn', cookieBar)!;
const cookiePolicyModal = qs<HTMLDialogElement>('#cookie-policy')!;

// ── State ─────────────────────────────────────────────────────────────────────

type State = {
    theme: 'dark' | 'light';
    accent: (typeof ACCENTS)[number];
    cookie: boolean;
};

const DEFAULT_STATE: State = {
    theme: 'dark',
    accent: ACCENTS[0],
    cookie: false,
};

const state: State = { ...DEFAULT_STATE };

function setState(
    newState:
        | Partial<typeof state>
        | ((prevState: typeof state) => Partial<typeof state>),
    forceUpdate = false,
) {
    const prevState = { ...state };

    Object.assign(
        state,
        typeof newState === 'function' ? newState(state) : newState,
    );

    const hasChanged = (key: keyof State) =>
        forceUpdate || (key in state && state[key] !== prevState[key]);

    if (hasChanged('theme')) html.dataset.theme = state.theme;

    if (hasChanged('accent')) html.style.setProperty('--accent', state.accent);

    if (hasChanged('cookie')) {
        const cookieBarOpen = cookieBar.matches(':popover-open');

        html.dataset.cookieAccepted = String(state.cookie);

        if (state.cookie && cookieBarOpen) cookieBar.hidePopover();
        if (!state.cookie && !cookieBarOpen) cookieBar.showPopover();
    }

    if (state.cookie) {
        localStorage.setItem('state', JSON.stringify(state));
    } else {
        localStorage.removeItem('state');
    }
}

(function render() {
    const savedState = localStorage.getItem('state');
    const initialState = { ...DEFAULT_STATE };

    if (savedState)
        try {
            Object.assign(initialState, JSON.parse(savedState));
        } catch {
            // Ignore JSON parse errors
        }

    setState(initialState, true);
})();

const REDUCE_MOTION = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
).matches;

// ── Theme ─────────────────────────────────────────────────────────────────────

themeBtn.addEventListener('click', () => {
    const next = state.theme === 'dark' ? 'light' : 'dark';

    // No View Transitions support (or reduced motion) → switch instantly.
    if (REDUCE_MOTION || !document.startViewTransition) {
        setState({ theme: next });
        return;
    }

    // Target theme drives the wipe direction (see ::view-transition in style.css).
    html.dataset.themeSwitch = next;
    const transition = document.startViewTransition(() =>
        setState({ theme: next }),
    );
    transition.finished.finally(() => delete html.dataset.themeSwitch);
});

accentBtn.addEventListener('click', () => {
    const accentIndex = ACCENTS.indexOf(state.accent);
    setState({ accent: ACCENTS[(accentIndex + 1) % ACCENTS.length] });
});

// ── Cookie bar ────────────────────────────────────────────────────────────────

cookieConsentBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        setState((prevState) => ({ cookie: !prevState.cookie }));
    });
});

// ── Message form (inline in #contact) ───────────────────────────────────────────

function messageFormInit() {
    const msgForm = qs<HTMLFormElement>('#msg-form');
    if (!msgForm) return;
    const msgTextarea = qs<HTMLTextAreaElement>('#msg-textarea');
    const msgSend = qs<HTMLButtonElement>('#msg-send');
    const msgHint = qs('#msg-hint');
    const msgSuccess = qs('#msg-success');

    const HINT_NO_EMAIL = "Don't forget your email!";
    // Single textarea: pull the first email-looking token out of the message.
    const EMAIL_RE = /[\w\-.+]+@([\w-]+\.)+[\w-]{2,}/;
    const getEmail = () => msgTextarea.value.match(EMAIL_RE)?.[0] ?? '';

    const msgState: {
        spamPasted: boolean;
        nudgeCount: number;
    } = {
        spamPasted: false,
        nudgeCount: 0,
    };

    const fontWeights = [400, 500, 600, 700, 800];
    const nudgeDegrees = [4, 8, 14, 20, 28];

    function setHint(text: string) {
        if (!msgHint) return;
        if (text !== HINT_NO_EMAIL && msgHint.style.fontWeight) {
            msgHint.style.fontWeight = '';
            msgHint.classList.remove('nudge');
            msgState.nudgeCount = 0;
        }
        msgHint.textContent = text;
    }

    function computeHint() {
        const msg = msgTextarea.value;
        const email = getEmail();

        if (msgState.spamPasted) {
            setHint("Whoa, that's a lot. Are you spamming me?");
            return;
        }
        if (email) {
            // Is there a message beyond just the email address?
            const rest = msg.replace(email, '').trim();
            setHint(
                rest.length > 0
                    ? `Got it; I'll reply to ${email}.`
                    : 'Nice email! Now add your message.',
            );
            return;
        }
        if (msg.trim().length === 0) {
            setHint('Include your email anywhere in your message.');
            return;
        }
        if (msg.length < 60) {
            setHint('Looking good; just remember to include your email.');
            return;
        }
        setHint("Don't forget to include your email so I can reply.");
    }

    msgTextarea.addEventListener('input', () => {
        // Auto-grow with the content.
        const lines = msgTextarea.value.split('\n').length;
        msgTextarea.rows = Math.max(4, lines);
        if (msgState.spamPasted && msgTextarea.value.length < 300)
            msgState.spamPasted = false;
        computeHint();
    });

    msgTextarea.addEventListener('paste', (e) => {
        const pasted = e.clipboardData?.getData('text') ?? '';
        if (pasted.length > 600) {
            msgState.spamPasted = true;
            setTimeout(computeHint, 0);
        }
    });

    function nudgeHint() {
        msgState.nudgeCount = Math.min(
            msgState.nudgeCount + 1,
            fontWeights.length - 1,
        );
        msgHint.style.fontWeight = String(fontWeights[msgState.nudgeCount]);
        msgHint.style.setProperty(
            '--nudge-deg',
            `${nudgeDegrees[msgState.nudgeCount]}deg`,
        );
        msgHint.classList.remove('nudge');
        requestAnimationFrame(() =>
            requestAnimationFrame(() => msgHint.classList.add('nudge')),
        );
    }

    function sendMessage() {
        msgTextarea.disabled = true;
        msgSend.disabled = true;

        // Front-end flow only for now. To actually deliver, POST here and
        // reveal success on ok / re-enable the field on error, e.g.:
        //   await fetch('https://api.iambrian.com/contact', {
        //       method: 'POST',
        //       headers: { 'Content-Type': 'application/json' },
        //       body: JSON.stringify({
        //           email: getEmail(),
        //           message: msgTextarea.value,
        //           type: 'contact',
        //       }),
        //   });
        msgSuccess.classList.add('is-visible');
        setTimeout(resetForm, 2800);
    }

    function resetForm() {
        msgForm.reset();
        msgTextarea.disabled = false;
        msgSend.disabled = false;
        msgTextarea.rows = 4;
        msgSuccess.classList.remove('is-visible');
        msgState.spamPasted = false;
        msgState.nudgeCount = 0;
        msgHint.style.fontWeight = '';
        msgHint.classList.remove('nudge');
        computeHint();
    }

    // Only send once the message contains an email; otherwise nudge the hint.
    msgForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (getEmail()) {
            sendMessage();
            return;
        }
        msgTextarea.focus();
        setHint(HINT_NO_EMAIL);
        nudgeHint();
    });
}

messageFormInit();

// ── Mobile nav ──────────────────────────────────────────────────────────────────
// Open/close is handled natively by the popover API (popovertarget); we just
// dismiss the drawer once a destination is picked.
(() => {
    const menu = qs<HTMLDialogElement>('#mobile-menu');
    if (!menu) return;
    qsa('a', menu).forEach((link) =>
        link.addEventListener('click', () => menu.hidePopover?.()),
    );
})();

// ── Dock the floating toggles above the footer ───────────────────────────────────
// Stay fixed while scrolling; once the footer would overlap, switch to absolute
// so the toggles park just above it instead of floating over it.
(() => {
    const fab = qs('.fab-group');
    const footer = qs('footer');
    if (!fab || !footer) return;
    const GAP = 20; // matches the 1.25rem fixed offset
    const update = () => {
        const fr = footer.getBoundingClientRect();
        // Once the footer is on screen, land the toggles inside it (vertically
        // centered) instead of floating over the page.
        if (fr.top < window.innerHeight - GAP) {
            fab.style.position = 'absolute';
            fab.style.bottom = 'auto';
            fab.style.top = `${
                window.scrollY +
                fr.top +
                (footer.offsetHeight - fab.offsetHeight) / 2
            }px`;
        } else {
            fab.style.position = '';
            fab.style.top = '';
            fab.style.bottom = '';
        }
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    update();
})();

// ── Fast in-page nav scrolling ──────────────────────────────────────────────────
// Anchor links use a fixed-duration animation regardless of distance, so jumping
// past the tall pinned Experience runway zips through it instead of crawling.
(() => {
    const NAV_OFFSET = 80; // matches scroll-padding-top (5rem)
    const DURATION = 600;
    const ease = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const scrollToY = (toY: number) => {
        const fromY = window.scrollY;
        const dist = toY - fromY;
        if (REDUCE_MOTION || Math.abs(dist) < 4) {
            window.scrollTo({
                top: toY,
                behavior: 'instant' as ScrollBehavior,
            });
            return;
        }
        let start: number | undefined;
        const step = (ts: number) => {
            if (start === undefined) start = ts;
            const p = Math.min((ts - start) / DURATION, 1);
            window.scrollTo({
                top: fromY + dist * ease(p),
                behavior: 'instant' as ScrollBehavior,
            });
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    qsa<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
        const id = a.getAttribute('href')?.slice(1);
        if (!id) return;
        a.addEventListener('click', (e) => {
            const target = document.getElementById(id);
            if (!target) return;
            e.preventDefault();
            const top =
                window.scrollY +
                target.getBoundingClientRect().top -
                NAV_OFFSET;
            scrollToY(Math.max(0, top));
            history.replaceState(null, '', '#' + id);
        });
    });
})();

// ── Directional section nudge ───────────────────────────────────────────────────
// When scrolling settles near a section boundary, nudge to the NEXT section in
// the direction the user was scrolling (never backward to the closest one).
(() => {
    if (REDUCE_MOTION) return;

    const sections = qsa<HTMLElement>('main > section');
    if (!sections.length) return;

    const NAV_OFFSET = 80;
    const zone = () => window.innerHeight * 0.4; // only nudge when this close

    const snapPoints = () =>
        sections
            .map((s) =>
                Math.max(
                    0,
                    Math.round(
                        window.scrollY +
                            s.getBoundingClientRect().top -
                            NAV_OFFSET,
                    ),
                ),
            )
            .sort((a, b) => a - b);

    let prevY = window.scrollY;
    let dir = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let snapping = false;

    const settle = () => {
        if (snapping || !dir) return;
        const cur = window.scrollY;
        const pts = snapPoints();
        let target: number | undefined;
        if (dir > 0) {
            const next = pts.find((p) => p > cur + 2);
            if (next !== undefined && next - cur < zone()) target = next;
        } else {
            const above = [...pts].reverse().find((p) => p < cur - 2);
            if (above !== undefined && cur - above < zone()) target = above;
        }
        if (target !== undefined && Math.abs(target - cur) > 2) {
            snapping = true;
            window.scrollTo({ top: target, behavior: 'smooth' });
            setTimeout(() => {
                snapping = false;
            }, 700);
        }
    };

    window.addEventListener(
        'scroll',
        () => {
            const y = window.scrollY;
            if (y !== prevY) dir = y > prevY ? 1 : -1;
            prevY = y;
            if (snapping) return;
            clearTimeout(timer);
            timer = setTimeout(settle, 150);
        },
        { passive: true },
    );
})();

// ── Recruiter quiz modal ────────────────────────────────────────────────────────
(() => {
    const dialog = qs<HTMLDialogElement>('#recruiter-quiz');
    if (!dialog) return;
    const quizForm = qs<HTMLFormElement>('form.quiz', dialog);
    const passForm = qs<HTMLFormElement>('form.quiz-pass', dialog);
    const emailInput = qs<HTMLInputElement>('#quiz-email', dialog);

    const setState = (s: string) => {
        dialog.dataset.state = s;
    };

    const fieldsets = () =>
        qsa<HTMLFieldSetElement>('.quiz-question', quizForm);
    // A disqualifying choice anywhere in the fieldset.
    const isFailed = (fs: HTMLFieldSetElement) =>
        !!qs('input[value="fail"]:checked', fs);
    const isAnswered = (fs: HTMLFieldSetElement) => {
        if (fs.dataset.type === 'amount') {
            const num = qs<HTMLInputElement>('input[type="number"]', fs);
            return (
                !!qs('input:checked', fs) || (num?.value.trim() ?? '') !== ''
            );
        }
        // radios and multi-select pills both register as a checked input
        return !!qs('input:checked', fs);
    };
    const hasFail = () => fieldsets().some(isFailed);

    qsa('[data-open-quiz]').forEach((btn) =>
        btn.addEventListener('click', () => {
            quizForm.reset();
            quizForm.classList.remove('submitted');
            passForm.reset();
            passForm.classList.remove('submitted');
            setState('quiz');
            dialog.showModal();
        }),
    );
    qsa('[data-close-quiz]', dialog).forEach((btn) =>
        btn.addEventListener('click', () => dialog.close()),
    );

    // As soon as a disqualifying answer is picked, flip to the fail state (and
    // back if they change it). Also clear the "unanswered" mark once answered.
    const onQuizChange = () => {
        // Only clear the post-submit "unanswered" flag once a question is
        // answered; never add it here (that only happens on a submit attempt).
        fieldsets().forEach((fs) => {
            if (isAnswered(fs)) fs.classList.remove('unanswered');
        });
        setState(hasFail() ? 'fail' : 'quiz');
    };
    quizForm.addEventListener('change', onQuizChange);
    quizForm.addEventListener('input', onQuizChange);

    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        quizForm.classList.add('submitted');
        let ok = true;
        fieldsets().forEach((fs) => {
            const answered = isAnswered(fs);
            fs.classList.toggle('unanswered', !answered);
            if (!answered) ok = false;
        });
        if (!ok) {
            setState('quiz');
            return;
        }
        setState(hasFail() ? 'fail' : 'pass');
    });

    passForm.addEventListener('submit', (e) => {
        e.preventDefault();
        passForm.classList.add('submitted');
        if (!emailInput.checkValidity()) return;
        // Front-end only — POST answers() + emailInput.value here to deliver.
        setState('sent');
    });
})();

// ── Experience: pinned horizontal scrollytelling ────────────────────────────────
// Pin the Experience section while the page scrolls and translate the card track
// left in step with scroll progress. JS owns the section height (the scroll
// runway) and the --exp-x offset. Falls back to the normal vertical list when
// motion is reduced or the cards already fit without overflow.
(() => {
    const section = qs('#experience');
    const sticky = qs('.exp-sticky', section);
    const track = qs('.exp-track', section);
    const dots = qsa('.exp-dot', section);
    if (!section || !track || REDUCE_MOTION) return;

    let overflow = 0;
    let activeDot = -1;

    const clamp = (n: number, lo: number, hi: number) =>
        Math.min(hi, Math.max(lo, n));

    // Document scroll position at which a given timeline index is centered.
    const scrollForIndex = (i: number) => {
        const frac = dots.length > 1 ? i / (dots.length - 1) : 0;
        return (
            window.scrollY +
            section.getBoundingClientRect().top +
            frac * overflow
        );
    };

    const render = () => {
        if (overflow <= 0) return;
        const progress = clamp(
            -section.getBoundingClientRect().top / overflow,
            0,
            1,
        );

        sticky.style.setProperty('--exp-x', `${-(progress * overflow)}px`);

        const next = dots.length
            ? Math.round(progress * (dots.length - 1))
            : -1;
        if (next !== activeDot) {
            dots[activeDot]?.classList.remove('is-active');
            dots[next]?.classList.add('is-active');
            activeDot = next;
        }
    };

    const measure = () => {
        section.classList.add('exp-pinned');
        overflow = track.scrollWidth - sticky.clientWidth;
        if (overflow <= 0) {
            section.classList.remove('exp-pinned');
            section.style.removeProperty('height');
            return;
        }
        section.style.height = `${window.innerHeight + overflow}px`;
        render();
    };

    dots.forEach((dot, i) =>
        dot.addEventListener('click', () => {
            window.scrollTo({ top: scrollForIndex(i), behavior: 'smooth' });
        }),
    );

    // Let a horizontal swipe / shift-wheel move through the cards while pinned:
    // translate horizontal delta into the page scroll that drives the animation,
    // and swallow it so the trackpad doesn't trigger back/forward navigation.
    // behavior:'instant' bypasses the global smooth scroll so it stays 1:1.
    window.addEventListener(
        'wheel',
        (e) => {
            if (overflow <= 0 || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) {
                return;
            }
            const rect = section.getBoundingClientRect();
            const pinned = rect.top <= 0 && rect.bottom > window.innerHeight;
            if (!pinned) return;
            window.scrollBy({
                top: e.deltaX,
                behavior: 'instant' as ScrollBehavior,
            });
            e.preventDefault();
        },
        { passive: false },
    );

    window.addEventListener('scroll', render, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    measure();
})();
