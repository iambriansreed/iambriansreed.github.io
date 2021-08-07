const fs = require('fs');
const path = require('path');
const buildHtml = require('./build-html');

const filesToWatch = [
    'src/script.ts',
    'src/index.html',
    'src/style.scss',
    'src/reset.scss',
];

const { exec } = require('child_process');

let updateTimeout = null;
let updateRunning = [];
let timeoutWaiting = [];

const updateFile = (file) => {
    const ext = path.extname(file).replace('.', '');

    if (ext === 'html') {
        buildHtml();
        return;
    }

    updateRunning.push(file);
    const newProcess = exec(`yarn build:${ext}`);
    newProcess.stdout.pipe(process.stdout);
    newProcess.on('close', () => {
        updateRunning = updateRunning.filter((f) => f !== file);

        if (ext !== 'html') buildHtml();

        if (updateRunning.length === 0) console.log('watching...');
    });
};

filesToWatch.forEach((file) => {
    fs.watch(file, () => {
        if (timeoutWaiting.includes(file)) return;

        timeoutWaiting.push(file);

        if (updateTimeout) clearTimeout(updateTimeout);

        updateTimeout = setTimeout(() => {
            updateFile(file);
            timeoutWaiting = timeoutWaiting.filter((f) => f !== file);
        }, 1500);
    });
});

buildHtml();
