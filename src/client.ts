/* The /contact and /quiz client, generated from the API's OpenAPI spec. Do not
   edit api.ts by hand — run `npm run generate` in the api repo and it is
   rewritten in place.

   A value import, unlike the shared-types package this replaced: skrapa resolves
   this file's import graph into the page's standalone script, so the functions
   are bundled along with the types. */
import {
    configure,
    contact,
    quiz,
    type ContactInput,
    type QuizInput,
} from './api';
import { initAppearance } from './appearance-client';

const qs = <T extends Element = HTMLElement>(
    s: string,
    parentNode?: ParentNode,
) => (parentNode || document).querySelector<T>(s);
const qsa = <T extends Element = HTMLElement>(
    s: string,
    parentNode?: ParentNode,
) => Array.from((parentNode || document).querySelectorAll<T>(s)) as T[];

// ── State ─────────────────────────────────────────────────────────────────────

// Remove previous state ('cookie' held the consent choice the old cookie bar
// asked for; 'state' was a JSON blob of everything). Theme and accent live in
// their own keys now, owned by appearance-client.ts.
localStorage.removeItem('state');
localStorage.removeItem('cookie');

// The project thumbnails with a light variant carry both as data-light and
// data-dark and no src (see ProjectCard in index.tsx), so only the current
// theme's file is ever requested.
const themedImgs = qsa<HTMLImageElement>('img[data-light][data-dark]');
initAppearance({
    onTheme(theme) {
        for (const img of themedImgs) img.src = img.dataset[theme]!;
    },
});

const REDUCE_MOTION = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
).matches;

// Set by an inline <script> the page renders just above this one (index.tsx),
// so the environment is decided at build time rather than sniffed at runtime.
// The generated client defaults to production, so point it at this build's target.
const { API_ORIGIN } = window;
configure({ baseUrl: API_ORIGIN });

// ── Submission bot filters ────────────────────────────────────────────────────

// When this script ran, which is close enough to when the form became fillable.
// Both forms report the gap at submit time and the API drops anything that
// arrives faster than a person could have typed it.
const LOADED_AT = Date.now();

// Matches the @Max on the API's elapsedMs. The filter only ever tests the field
// against a *lower* bound, so a tab left open past this has nothing to prove by
// reporting the true figure — and sending it unclamped fails validation
// outright, turning a real submission into "Unable to send message".
const MAX_ELAPSED_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * The honeypot value and time-on-page to send alongside a submission.
 *
 * Reads the field by id rather than through the form, so the quiz's answers —
 * which are serialised straight out of its questions form — never pick it up.
 */
function botFilterFields(honeypotId: string) {
    return {
        website: document.querySelector<HTMLInputElement>(`#${honeypotId}`)
            ?.value,
        elapsedMs: Math.min(Date.now() - LOADED_AT, MAX_ELAPSED_MS),
    };
}

/* `elapsedMs` is part of the published input types; the honeypot is deliberately
   not, so that neither the API's spec nor the generated client names it. It still
   rides along on the wire — the API validates it off the DTO before the handler
   ever sees a ContactInput/QuizInput — which is why this intersection exists. */
type BotFilterFields = ReturnType<typeof botFilterFields>;

// ── Message form (inline in #contact) ───────────────────────────────────────────

function messageFormInit() {
    const msgForm = qs<HTMLFormElement>('#msg-form');
    const msgTextarea = qs<HTMLTextAreaElement>('#msg-textarea');
    const msgSend = qs<HTMLButtonElement>('#msg-send');
    const msgHint = qs('#msg-hint');
    const msgSuccess = qs('#msg-success');

    if (!msgForm || !msgTextarea || !msgSend || !msgHint || !msgSuccess) return;

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

    const setHint = (text: string) => {
        if (!msgHint) return;
        if (text !== HINT_NO_EMAIL && msgHint.style.fontWeight) {
            msgHint.style.fontWeight = '';
            msgHint.classList.remove('nudge');
            msgState.nudgeCount = 0;
        }
        msgHint.textContent = text;
    };

    const computeHint = () => {
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
    };

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

    const nudgeHint = () => {
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
    };

    const sendMessage = async () => {
        msgTextarea.disabled = true;
        msgSend.disabled = true;

        const payload: ContactInput & BotFilterFields = {
            email: getEmail(),
            message: msgTextarea.value,
            ...botFilterFields('hp-contact'),
        };

        try {
            /* Throws on any non-2xx, so a failed submission lands in the catch
               below rather than having to be read back out of the body. The
               API answers 200 { success: true } even for a submission its bot
               filters dropped, which is deliberate — see the honeypot note.

               Reaching here therefore means delivered, so only an explicit
               { success: false } counts as a failure: an empty 2xx body parses
               to null, and treating that as a failure would tell someone their
               message had not sent when it had. */
            const data = await contact(payload);
            if (data?.success !== false) {
                msgSuccess.classList.add('is-visible');
                setTimeout(resetForm, 2800);
                return;
            }
            throw new Error('send failed');
        } catch (err) {
            console.error('sendMessage error', err);
            alert('Unable to send message. Please try again later.');
            msgTextarea.disabled = false;
            msgSend.disabled = false;
        }
    };

    const resetForm = () => {
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
    };

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

// ── Hero flare ──────────────────────────────────────────────────────────────────
// The sweep itself is CSS (.hero-statement.is-flaring in home.css); this only
// decides when. Each pass is followed by a random rest of 6 to 18 seconds, the
// first one shorter so the page does not sit still after load. Reduced motion
// skips it here as well as in the stylesheet.
(() => {
    const statement = qs('.hero-statement');
    if (!statement || REDUCE_MOTION) return;

    const flare = () => statement.classList.add('is-flaring');
    const rest = (min: number, max: number) =>
        setTimeout(flare, min + Math.random() * (max - min));

    statement.addEventListener('animationend', () => {
        statement.classList.remove('is-flaring');
        rest(6000, 18000);
    });
    rest(1500, 4000);
})();

// ── Header reveal ────────────────────────────────────────────────────────────────
// The header sits hidden just above the viewport (top: -4rem). Drop it into view
// once the hero has scrolled past it: the rootMargin trims the header's own
// height off the top of the viewport, so the hero stops intersecting when its
// bottom edge slides under where the header will land.
(() => {
    const header = qs<HTMLElement>('header');
    const hero = qs('.hero');
    if (!header || !hero) return;

    const observer = new IntersectionObserver(
        ([entry]) => {
            header.classList.toggle('is-pinned', !entry.isIntersecting);
        },
        { rootMargin: `-${header.offsetHeight}px 0px 0px 0px` },
    );
    observer.observe(hero);
})();

// ── Fast in-page nav scrolling ──────────────────────────────────────────────────
// Anchor links use a fixed-duration animation regardless of distance, so a long
// jump takes no longer than a short one.
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

// ── Recruiter quiz modal ────────────────────────────────────────────────────────
(() => {
    const dialog = qs<HTMLDialogElement>('#recruiter-quiz');
    if (!dialog) return;
    const quizForm = qs<HTMLFormElement>('form.quiz', dialog);
    const passForm = qs<HTMLFormElement>('form.quiz-pass', dialog);
    const emailInput = qs<HTMLInputElement>('#quiz-email', dialog);

    if (!quizForm || !passForm || !emailInput) return;

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

    // The quiz has a shareable address, iambrian.com/#quiz, so a recruiter can
    // be sent straight to it. Opening pushes the hash, so the back button
    // closes the dialog; closing strips it, so a reload or a copied tab does
    // not reopen it.
    const QUIZ_HASH = '#quiz';
    const openQuiz = () => {
        quizForm.reset();
        quizForm.classList.remove('submitted');
        passForm.reset();
        passForm.classList.remove('submitted');
        setState('quiz');
        dialog.showModal();
        if (location.hash !== QUIZ_HASH) history.pushState(null, '', QUIZ_HASH);
    };

    qsa('[data-open-quiz]').forEach((btn) =>
        btn.addEventListener('click', openQuiz),
    );
    qsa('[data-close-quiz]', dialog).forEach((btn) =>
        btn.addEventListener('click', () => dialog.close()),
    );
    // Fires for the close button, Escape, and the back button alike.
    dialog.addEventListener('close', () => {
        if (location.hash === QUIZ_HASH) {
            history.replaceState(null, '', location.pathname + location.search);
        }
    });
    window.addEventListener('hashchange', () => {
        if (location.hash === QUIZ_HASH && !dialog.open) openQuiz();
        else if (location.hash !== QUIZ_HASH && dialog.open) dialog.close();
    });
    if (location.hash === QUIZ_HASH) {
        // Land on the contact section first, so closing the dialog leaves the
        // form and the LinkedIn and GitHub links in view.
        qs('#contact')?.scrollIntoView({
            block: 'start',
            behavior: 'instant' as ScrollBehavior,
        });
        openQuiz();
    }

    // As soon as a disqualifying answer is picked, flip to the fail state (and
    // back if they change it). Also clear the "unanswered" mark once answered.
    const onQuizChange = () => {
        // Only clear the post-submit "unanswered" flag once a question is
        // answered; never add it here (that only happens on a submit attempt).
        fieldsets().forEach((fs) => {
            if (isAnswered(fs)) fs.classList.remove('unanswered');
        });
        const wasFailed = dialog.dataset.state === 'fail';
        const failed = hasFail();
        setState(failed ? 'fail' : 'quiz');
        // The verdict renders below the questions and the submit button hides,
        // so on the switch into the fail state bring the verdict to the reader.
        // Only on the switch: later edits while still failing leave focus be.
        if (failed && !wasFailed) {
            const heading = qs<HTMLElement>('.quiz-fail h3', dialog);
            if (heading) {
                heading.tabIndex = -1;
                heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                heading.focus({ preventScroll: true });
            }
        }
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
            const first = qs<HTMLFieldSetElement>(
                '.quiz-question.unanswered',
                quizForm,
            );
            first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            first?.querySelector<HTMLElement>('input')?.focus({
                preventScroll: true,
            });
            return;
        }
        setState(hasFail() ? 'fail' : 'pass');
    });

    passForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        passForm.classList.add('submitted');
        if (!emailInput.checkValidity()) return;

        // collect quiz answers from quizForm
        const fd = new FormData(quizForm);
        const payload: Record<
            string,
            FormDataEntryValue | FormDataEntryValue[]
        > = {};
        for (const [k, v] of fd.entries()) {
            if (Object.prototype.hasOwnProperty.call(payload, k)) {
                const existing = payload[k];
                payload[k] = Array.isArray(existing)
                    ? [...existing, v]
                    : [existing, v];
            } else {
                payload[k] = v;
            }
        }

        const submission: QuizInput & BotFilterFields = {
            email: emailInput.value,
            message: JSON.stringify(payload),
            ...botFilterFields('hp-quiz'),
        };

        try {
            // Same as sendMessage: a 2xx is a delivered submission, so only an
            // explicit { success: false } is treated as a failure.
            const data = await quiz(submission);
            if (data?.success !== false) {
                setState('sent');
                return;
            }
            throw new Error('submit failed');
        } catch (err) {
            console.error('quiz submit error', err);
            alert('Unable to submit quiz. Please try again later.');
        }
    });
})();
