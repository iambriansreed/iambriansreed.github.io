/* The first list a visitor sees, before they pick a saved list or pass ?i=. */
const DEFAULT_ENTRIES = [
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

export function Page(): Skrapa.Page {
    return {
        // Hidden until client.ts has sized the textarea and drawn the wheel, so
        // the first paint is not an empty canvas and a one-line textarea.
        shellAttrs: { body: { style: 'visibility:hidden' } },
        body: (
            <>
                <main class="wheel-section">
                    <h1 class="visually-hidden">Spin Wheel</h1>
                    <div class="wheel-container">
                        <div class="pointer" aria-hidden="true"></div>
                        <canvas
                            id="wheel"
                            width="800"
                            height="800"
                            role="img"
                            aria-label="Spin wheel"
                        ></canvas>
                        <button type="button" class="spin-btn" id="spinBtn">
                            Spin
                        </button>
                    </div>
                    <p
                        class="visually-hidden"
                        id="result"
                        aria-live="polite"
                    ></p>
                </main>

                <button
                    type="button"
                    class="drawer-toggle open"
                    id="drawerToggle"
                    aria-label="Toggle entries panel"
                    aria-controls="drawer"
                    aria-expanded="true"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <line class="bar1" x1="4" y1="7" x2="20" y2="7" />
                        <line class="bar2" x1="4" y1="12" x2="20" y2="12" />
                        <line class="bar3" x1="4" y1="17" x2="20" y2="17" />
                    </svg>
                </button>

                <div class="drawer-backdrop visible" id="drawerBackdrop"></div>

                <aside class="drawer open" id="drawer" aria-label="Entries">
                    <label class="drawer-title" for="entries">
                        Entries
                    </label>
                    <textarea id="entries">
                        {DEFAULT_ENTRIES.join('\n')}
                    </textarea>
                    <div class="save-row">
                        <input
                            type="text"
                            id="listName"
                            placeholder="List name…"
                            aria-label="List name"
                        />
                        <button type="button" class="save-btn" id="saveBtn">
                            Save
                        </button>
                    </div>
                    <div class="entry-count" id="count">
                        0 entries
                    </div>

                    <h2 class="section-title">Saved Lists</h2>
                    <div class="saved-lists" id="savedContainer"></div>

                    <div class="history" id="historySection" hidden>
                        <h2 class="section-title">History</h2>
                        <div class="history-list" id="historyList"></div>
                    </div>
                </aside>

                <button type="button" class="reset-btn" id="resetBtn">
                    Reset
                </button>

                <script src="./client.ts"></script>
            </>
        ),
    };
}
