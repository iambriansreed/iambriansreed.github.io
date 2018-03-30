const fs = require('fs');
const config = require('./config.js');

const skillsetTemplate = (name, percentage) => `<div class="skillset">
    <h5>${name}</h5>
    <div class="progress-bar">
        <div class="percentage" data-percentage="${percentage}" style="width: 0;"><span>${percentage}%</span></div>
    </div>
</div>`;

module.exports = () =>
    fs.readFile('src/index.html', 'utf8', (err, data) => {
        if (err) {
            return console.log(err);
        }

        data = data.replace(/<!-- skillsets -->/g,
            config.skillsets.map(s => skillsetTemplate(s.name, s.percentage)).join(''));

        data = (data.match(/<!-- (.*?)\.svg -->/g) || []).reduce((result, value) => {
            const name = value.match(/\s(.*?)\.svg/)[1];
            const svg = fs.readFileSync(`src/${name}.svg`, 'utf8');
            return result.replace(value, svg);
        }, data);

        fs.writeFile('index.html', data, 'utf8', (err) => {
            if (err) return console.log(err);
        });
    });