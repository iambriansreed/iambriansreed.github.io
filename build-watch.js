const fs = require('fs');

const build = () => {
    require('./build')();
}

const filesToWatch = [
    'config.js',
    'build.js',
    'src/index.html',
    'css/style.css',
];

filesToWatch.forEach(file => {
    fs.watch(file, {
        encoding: 'buffer'
    }, (eventType, filename) => {
        build();
        console.info(file + ' updated!')
    });
});

build();