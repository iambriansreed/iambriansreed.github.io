declare global {
    interface Window {
        /**
         * Injected by an inline <script> each page shell renders; see index.tsx.
         * @example https://local.api.iambrian.com
         */
        API_ORIGIN: string;
    }
}

export {};
