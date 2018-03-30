const fs = require('fs');

const build = () => {
    require('./build')();
}

fs.watch('build.js', {
    encoding: 'buffer'
}, (eventType, filename) => { build(); console.info('build.js updated!') });

fs.watch('src/index.html', {
    encoding: 'buffer'
}, (eventType, filename) => { build(); console.info('index updated!') });

build();