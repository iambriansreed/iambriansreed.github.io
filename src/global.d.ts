declare global {
    interface Window {
        /**
         * Injected by an inline <script> each page shell renders; see index.tsx.
         * @example https://local.api.iambrian.com
         */
        API_ORIGIN: string;
    }

    type Theme = 'dark' | 'light';
    type Accent =
        | '#7a8a3a'
        | '#5a8a6a'
        | '#4a7fa5'
        | '#c97a3a'
        | '#b5542a'
        | '#b56070'
        | '#7a5a9a'
        | '#3a8a8a';
}

export {};
