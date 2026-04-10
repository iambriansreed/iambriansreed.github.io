import { defineConfig } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import App from './src/app.tsx';

// https://vite.dev/config/
export default defineConfig({
    server: {
        host: true,
        port: 3000,
        strictPort: true,
        allowedHosts: ['local.local'],
    },
    build: {
        modulePreload: false,
    },
    plugins: [
        {
            name: 'watch-app',
            configureServer(server) {
                server.watcher.add(['./src/app.tsx']);
            },
        },
        {
            name: 'render-app',
            /**
             *
             * Renders the React app to static HTML and injects it into the index.html file by replacing the placeholder comment `<!-- app_html -->`.
             * This allows the app to be rendered on the server side and sent as static HTML to the client, improving performance and SEO.
             */
            transformIndexHtml: (html) =>
                html.replace(
                    '<!-- app_html -->',
                    renderToStaticMarkup(createElement(App))
                        // Replace `data-style` with `style` to ensure that the inline styles are correctly applied in the rendered HTML.
                        .replace(/data-style/g, 'style'),
                ),
        },
    ],
});
