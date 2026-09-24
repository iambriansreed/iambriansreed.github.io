import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import jsxA11y from 'eslint-plugin-jsx-a11y';

// skrapa's JSX keeps HTML attribute names
const SKRAPA_JSX_ATTRIBUTES = {
    class: ['class', 'className'],
    for: ['for', 'htmlFor'],
    'accept-charset': ['accept-charset', 'acceptCharset'],
    accesskey: ['accesskey', 'accessKey'],
    autoplay: ['autoplay', 'autoPlay'],
    autofocus: ['autofocus', 'autoFocus'],
    colspan: ['colspan', 'colSpan'],
    contenteditable: ['contenteditable', 'contentEditable'],
    contextmenu: ['contextmenu', 'contextMenu'],
    crossorigin: ['crossorigin', 'crossOrigin'],
    datetime: ['datetime', 'dateTime'],
    enctype: ['enctype', 'encType'],
    formaction: ['formaction', 'formAction'],
    hreflang: ['hreflang', 'hrefLang'],
    'http-equiv': ['http-equiv', 'httpEquiv'],
    inputmode: ['inputmode', 'inputMode'],
    maxlength: ['maxlength', 'maxLength'],
    minlength: ['minlength', 'minLength'],
    novalidate: ['novalidate', 'noValidate'],
    readonly: ['readonly', 'readOnly'],
    rowspan: ['rowspan', 'rowSpan'],
    spellcheck: ['spellcheck', 'spellCheck'],
    srcdoc: ['srcdoc', 'srcDoc'],
    srclang: ['srclang', 'srcLang'],
    srcset: ['srcset', 'srcSet'],
    tabindex: ['tabindex', 'tabIndex'],
    usemap: ['usemap', 'useMap'],
    'clip-path': ['clip-path', 'clipPath'],
    'fill-opacity': ['fill-opacity', 'fillOpacity'],
    'stroke-width': ['stroke-width', 'strokeWidth'],
    viewbox: ['viewbox', 'viewBox'],
};

export default defineConfig([
    globalIgnores(['dist', '.skrapa']),
    {
        files: ['src/**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            jsxA11y.flatConfigs.recommended,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        settings: {
            'jsx-a11y': {
                attributes: SKRAPA_JSX_ATTRIBUTES,
            },
        },
    },
]);
