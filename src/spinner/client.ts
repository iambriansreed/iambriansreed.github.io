/*
 Spin wheel client.

 Draws the wheel on a canvas from the textarea's lines, spins it, and keeps
 saved lists in localStorage. A list can also arrive in the URL as
 ?i=Pizza,Tacos,Nachos, which replaces the default entries on load.

 Wrapped in an IIFE because skrapa compiles each client.ts as a global script,
 so top-level names here would collide with other pages' scripts.
*/

/* canvas-confetti, loaded from the CDN by the shell with defer. */
declare function confetti(options: {
    particleCount: number;
    spread: number;
    startVelocity: number;
    origin: { x: number; y: number };
}): void;

(() => {
    const byId = <T extends HTMLElement = HTMLElement>(id: string): T => {
        const el = document.getElementById(id);
        if (!el) throw new Error(`spinner: #${id} is missing from the page`);
        return el as T;
    };

    const ROYGBIV = [
        [
            '#E84040',
            '#FF8C00',
            '#F5D020',
            '#3CB043',
            '#2196F3',
            '#4B0082',
            '#8B00FF',
        ],
        [
            '#FF6B6B',
            '#FFA94D',
            '#FFE066',
            '#69DB7C',
            '#4DABF7',
            '#7950F2',
            '#DA77F2',
        ],
        [
            '#C62828',
            '#E65100',
            '#F9A825',
            '#2E7D32',
            '#1565C0',
            '#4A148C',
            '#AB47BC',
        ],
    ];

    function getColors(count: number) {
        const result: string[] = [];
        for (let i = 0; i < count; i++) {
            const band = Math.floor(i / 7);
            result.push(ROYGBIV[band % ROYGBIV.length][i % 7]);
        }
        return result;
    }

    const FONT =
        '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';
    const TWO_PI = Math.PI * 2;
    const canvas = byId<HTMLCanvasElement>('wheel');
    const ctx = canvas.getContext('2d')!;
    const textarea = byId<HTMLTextAreaElement>('entries');
    const spinBtn = byId<HTMLButtonElement>('spinBtn');
    const countEl = byId('count');
    const resultEl = byId('result');
    const historySection = byId('historySection');
    const historyList = byId('historyList');

    let items: string[] = [];
    let angle = 0;
    let spinning = false;
    const history: string[] = [];
    let highlightIndex = -1;

    function getItems() {
        return textarea.value
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean);
    }

    function drawWheel() {
        const w = canvas.width,
            h = canvas.height;
        const cx = w / 2,
            cy = h / 2,
            r = w / 2 - 16;
        ctx.clearRect(0, 0, w, h);

        if (items.length === 0) {
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, TWO_PI);
            ctx.fillStyle = '#151D2E';
            ctx.fill();
            ctx.strokeStyle = '#1E2A3E';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.fillStyle = '#8794AD';
            ctx.font = `500 24px ${FONT}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Add entries below', cx, cy);
            return;
        }

        const sliceAngle = TWO_PI / items.length;
        const colors = getColors(items.length);
        const isHighlighting = highlightIndex >= 0;

        if (isHighlighting) ctx.globalAlpha = 0.5;

        items.forEach((item, i) => {
            const start = angle + i * sliceAngle;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, start, start + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[i];
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.15)';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(start + sliceAngle / 2);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fff';
            ctx.shadowColor = 'rgba(0,0,0,0.55)';
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;

            const textR = 28 + (r - 28) * 0.6;
            const maxLen = (r - 28) * 0.7;
            const maxFS = Math.min(48, sliceAngle * r * 0.45);
            let fs = Math.max(12, Math.floor(maxFS));
            ctx.font = `700 ${fs}px ${FONT}`;
            while (ctx.measureText(item).width > maxLen && fs > 12) {
                fs--;
                ctx.font = `700 ${fs}px ${FONT}`;
            }
            let label = item;
            if (ctx.measureText(label).width > maxLen) {
                while (
                    ctx.measureText(label + '…').width > maxLen &&
                    label.length > 1
                )
                    label = label.slice(0, -1);
                label += '…';
            }
            ctx.fillText(label, textR, 0);
            ctx.shadowColor = 'transparent';
            ctx.restore();
        });

        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.arc(cx, cy, 24, 0, TWO_PI);
        ctx.fillStyle = '#0C1220';
        ctx.fill();
        ctx.strokeStyle = '#1E2A3E';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isHighlighting && highlightIndex < items.length) {
            const winner = items[highlightIndex];
            ctx.beginPath();
            ctx.arc(cx, cy, r + 2, 0, TWO_PI);
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fill();

            let fs = r * 0.22;
            ctx.font = `800 ${fs}px ${FONT}`;
            while (ctx.measureText(winner).width > r * 1.5 && fs > 20) {
                fs--;
                ctx.font = `800 ${fs}px ${FONT}`;
            }
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(78,154,245,0.35)';
            ctx.shadowBlur = 40;
            ctx.fillStyle = '#fff';
            ctx.fillText(winner, cx, cy);
            ctx.shadowColor = 'transparent';
        }
    }

    function celebrate() {
        // The CDN script is deferred and optional; a blocked or slow load
        // should cost the confetti, not the result.
        if (typeof confetti !== 'function') return;
        confetti({
            particleCount: 150,
            spread: 180,
            startVelocity: 50,
            origin: { x: 0.1, y: 0.5 },
        });
        confetti({
            particleCount: 150,
            spread: 180,
            startVelocity: 50,
            origin: { x: 0.9, y: 0.5 },
        });
        confetti({
            particleCount: 150,
            spread: 180,
            startVelocity: 55,
            origin: { x: 0.5, y: 0.3 },
        });
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 160,
                startVelocity: 40,
                origin: { x: 0.3, y: 0.7 },
            });
            confetti({
                particleCount: 100,
                spread: 160,
                startVelocity: 40,
                origin: { x: 0.7, y: 0.7 },
            });
        }, 200);
    }

    function spin() {
        if (spinning || items.length < 2) return;
        spinning = true;
        spinBtn.disabled = true;
        highlightIndex = -1;
        resultEl.textContent = '';

        const totalRotation = TWO_PI * (5 + Math.random() * 5);
        const spinDuration = 4000 + Math.random() * 1000;
        const startAngle = angle;
        const windupAngle = -(Math.PI * 0.15 + Math.random() * Math.PI * 0.1);
        const windupDuration = 350;
        const startTime = performance.now();

        const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

        function animate(now: number) {
            const elapsed = now - startTime;
            if (elapsed < windupDuration) {
                angle =
                    startAngle +
                    windupAngle *
                        Math.sin(((elapsed / windupDuration) * Math.PI) / 2);
                drawWheel();
                requestAnimationFrame(animate);
                return;
            }
            const progress = Math.min(
                (elapsed - windupDuration) / spinDuration,
                1,
            );
            angle =
                startAngle +
                windupAngle +
                (-windupAngle + totalRotation) * easeOut(progress);
            drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animate);
                return;
            }

            const sliceAngle = TWO_PI / items.length;
            const norm = ((angle % TWO_PI) + TWO_PI) % TWO_PI;
            const winnerIndex =
                Math.floor(((TWO_PI - norm) % TWO_PI) / sliceAngle) %
                items.length;
            const winner = items[winnerIndex];

            // Settle the pointer on the middle of the winning slice.
            const target = TWO_PI - (winnerIndex * sliceAngle + sliceAngle / 2);
            let correction = target - norm;
            if (correction > Math.PI) correction -= TWO_PI;
            if (correction < -Math.PI) correction += TWO_PI;

            setTimeout(() => {
                const snapStart = performance.now();
                const snapFrom = angle;
                function snapAnimate(now: number) {
                    const t = Math.min((now - snapStart) / 400, 1);
                    const ease =
                        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
                    angle = snapFrom + correction * ease;
                    drawWheel();
                    if (t < 1) {
                        requestAnimationFrame(snapAnimate);
                        return;
                    }
                    spinning = false;
                    spinBtn.disabled = false;
                    highlightIndex = winnerIndex;
                    drawWheel();
                    resultEl.textContent = `Winner: ${winner}`;
                    celebrate();
                    history.unshift(winner);
                    if (history.length > 20) history.pop();
                    renderHistory();
                }
                requestAnimationFrame(snapAnimate);
            }, 500);
        }
        requestAnimationFrame(animate);
    }

    function renderHistory() {
        historySection.hidden = history.length === 0;
        historyList.replaceChildren(
            ...history.map((h) => {
                const chip = document.createElement('span');
                chip.className = 'history-chip';
                chip.textContent = h;
                return chip;
            }),
        );
    }

    function autoResize() {
        textarea.style.height = 'auto';
        textarea.style.overflowY = 'hidden';
        const maxH = parseFloat(getComputedStyle(textarea).maxHeight);
        const needed = textarea.scrollHeight;
        if (needed > maxH) {
            textarea.style.height = maxH + 'px';
            textarea.style.overflowY = 'auto';
        } else {
            textarea.style.height = needed + 'px';
        }
    }

    function update() {
        items = getItems();
        const n = items.length;
        countEl.textContent = `${n} entr${n === 1 ? 'y' : 'ies'}`;
        spinBtn.disabled = n < 2;
        if (!spinning && n > 0) angle = -(TWO_PI / n) / 2;
        autoResize();
        updateSaveBtn();
        drawWheel();
    }

    /* ---------- Saved lists ---------- */
    const listNameInput = byId<HTMLInputElement>('listName');
    const saveBtn = byId<HTMLButtonElement>('saveBtn');
    const savedContainer = byId('savedContainer');
    const STORAGE_KEY = 'spinwheel_lists';
    const SEEDED_KEY = 'spinwheel_seeded';

    type Lists = Record<string, string[]>;

    function loadSavedLists(): Lists {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {};
        } catch {
            return {};
        }
    }
    function saveLists(lists: Lists) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
        } catch {
            /* private mode or storage full: lists last for this visit only */
        }
    }

    function renderSavedLists() {
        const lists = loadSavedLists();
        const names = Object.keys(lists);
        if (names.length === 0) {
            const empty = document.createElement('span');
            empty.className = 'no-saved';
            empty.textContent = 'No saved lists yet';
            savedContainer.replaceChildren(empty);
            return;
        }
        savedContainer.replaceChildren(
            ...names.map((name) => {
                const entries = lists[name];
                const row = document.createElement('div');
                row.className = 'saved-item';

                const nameBtn = document.createElement('button');
                nameBtn.type = 'button';
                nameBtn.className = 'saved-item-name';
                nameBtn.textContent = name;
                nameBtn.addEventListener('click', () => {
                    textarea.value = entries.join('\n');
                    listNameInput.value = name;
                    update();
                });

                const cntEl = document.createElement('span');
                cntEl.className = 'saved-item-count';
                cntEl.textContent = `${entries.length} items`;

                const delBtn = document.createElement('button');
                delBtn.type = 'button';
                delBtn.className = 'saved-item-delete';
                delBtn.textContent = '×';
                delBtn.setAttribute('aria-label', `Delete ${name}`);
                delBtn.addEventListener('click', () => {
                    const all = loadSavedLists();
                    delete all[name];
                    saveLists(all);
                    renderSavedLists();
                });

                row.append(nameBtn, cntEl, delBtn);
                return row;
            }),
        );
    }

    function updateSaveBtn() {
        const lists = loadSavedLists();
        if (!listNameInput.value.trim() && items.length > 0) {
            const s = JSON.stringify(items);
            const match = Object.keys(lists).find(
                (k) => JSON.stringify(lists[k]) === s,
            );
            if (match) listNameInput.value = match;
        }
        const cur = listNameInput.value.trim();
        if (!cur || items.length === 0) {
            saveBtn.disabled = true;
            return;
        }
        const saved = lists[cur];
        saveBtn.disabled = !!(
            saved && JSON.stringify(saved) === JSON.stringify(items)
        );
    }

    saveBtn.addEventListener('click', () => {
        const name = listNameInput.value.trim();
        if (!name || items.length === 0) return;
        const lists = loadSavedLists();
        lists[name] = items;
        saveLists(lists);
        renderSavedLists();
        updateSaveBtn();
    });
    listNameInput.addEventListener('input', updateSaveBtn);

    textarea.addEventListener('input', update);
    textarea.addEventListener('blur', () => {
        textarea.value = getItems().join('\n');
        update();
    });
    spinBtn.addEventListener('click', spin);
    canvas.addEventListener('click', spin);

    /* ---------- Drawer ---------- */
    const drawer = byId('drawer');
    const drawerToggle = byId('drawerToggle');
    const drawerBackdrop = byId('drawerBackdrop');

    function toggleDrawer() {
        const open = drawer.classList.toggle('open');
        drawerToggle.classList.toggle('open', open);
        drawerToggle.setAttribute('aria-expanded', String(open));
        drawerBackdrop.classList.toggle('visible', open);
    }
    drawerToggle.addEventListener('click', toggleDrawer);
    drawerBackdrop.addEventListener('click', toggleDrawer);

    /* ---------- Seed defaults ---------- */
    try {
        if (!localStorage.getItem(SEEDED_KEY)) {
            const lists = loadSavedLists();
            if (Object.keys(lists).length === 0) {
                lists['Junk Food'] = [
                    'Pizza',
                    'Tacos',
                    'Nachos',
                    'Hot Dogs',
                    'Burgers',
                    'Fried Chicken',
                    'Donuts',
                    'Corn Dogs',
                    'Mozzarella Sticks',
                    'Onion Rings',
                ];
                lists['Star Trek'] = [
                    'Kirk',
                    'Picard',
                    'Sisko',
                    'Janeway',
                    'Archer',
                    'Pike',
                    'Darth Vader',
                    'Chewbacca',
                    'Yoda',
                ];
                saveLists(lists);
            }
            localStorage.setItem(SEEDED_KEY, '1');
        }
    } catch {
        /* storage blocked: start with no saved lists */
    }

    byId('resetBtn').addEventListener('click', () => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(SEEDED_KEY);
        } catch {
            /* nothing stored to clear */
        }
        location.reload();
    });

    /* ---------- ?i= entries ---------- */
    // URLSearchParams decodes, so ?i=Hot%20Dogs,Tacos and ?i=Hot+Dogs,Tacos
    // both work. An i with nothing usable in it keeps the default list.
    const fromUrl = (new URLSearchParams(location.search).get('i') ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    if (fromUrl.length > 0) textarea.value = fromUrl.join('\n');

    update();
    renderSavedLists();
    document.body.style.visibility = 'visible';
})();
