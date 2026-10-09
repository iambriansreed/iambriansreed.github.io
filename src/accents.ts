/* The eight accent colours, in the order the cycle and the swatch rows use.
   appearance.tsx renders them at build time and appearance-client.ts reads them in
   the browser, so this is the one list; the Accent type in global.d.ts
   mirrors it. */
export const ACCENTS: readonly Accent[] = [
    '#7a8a3a',
    '#5a8a6a',
    '#4a7fa5',
    '#c97a3a',
    '#b5542a',
    '#b56070',
    '#7a5a9a',
    '#3a8a8a',
];
