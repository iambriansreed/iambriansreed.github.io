const fs = require('fs');
const config = require('./config.js');

const skillsetTemplate = (name, percentage) => `<div class="skillset">
    <h5>${name}</h5>
    <div class="progress-bar">
        <div class="percentage" style="width: ${percentage}%;"><span>${percentage}%</span></div>
    </div>
</div>`;

const updateIndex = () =>
    fs.readFile('src/index.html', 'utf8', (err, data) => {
        if (err) {
            return console.log(err);
        }

        data = data.replace(/<!-- skillsets -->/g,
            config.skillsets.map(s => skillsetTemplate(s.name, s.percentage)).join(''));

        data = (data.match(/<!-- (.*?)\.svg -->/g) || []).reduce((result, value) => {
            const name = value.match(/\s(.*?)\.svg/)[1];
            console.log(name);
            const svg = fs.readFileSync(`src/${name}.svg`, 'utf8');
            return result.replace(value, svg);
        }, data);

        fs.writeFile('index.html', data, 'utf8', (err) => {
            if (err) return console.log(err);
            console.log('Index built.');
        });
    });

updateIndex();

fs.watch('build.js', {
    encoding: 'buffer'
}, (eventType, filename) => {
    updateIndex();
});

fs.watch('src/index.html', {
    encoding: 'buffer'
}, (eventType, filename) => {

    updateIndex();

});