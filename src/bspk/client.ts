/* The accent and theme controls (shared appearance-client.ts), plus this page's themed images.
   Theme and accent are kept in localStorage and restored by the shell's inline
   script, so a choice made on the home page carries over. */
import { initAppearance } from '../appearance-client';

// The banner and figures carry both theme variants as data-light and
// data-dark and no src (see ThemedImg in index.tsx), so only the current
// theme's file is ever requested. A figure's link follows its image.
const themedImgs = document.querySelectorAll<HTMLImageElement>(
    'img[data-light][data-dark]',
);

initAppearance({
    onTheme(theme) {
        for (const img of themedImgs) {
            const src = img.dataset[theme]!;
            img.src = src;
            const link = img.closest('a');
            if (link) link.href = src;
        }
    },
});
