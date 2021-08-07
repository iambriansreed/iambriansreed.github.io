const fs = require('fs');

module.exports = () => {
    process.stdout.write('\nRebuilding index.html');

    try {
        let data = fs.readFileSync('src/index.html', 'utf8');

        data = (data.match(/<!-- (.*?)\.svg -->/g) || []).reduce(
            (result, value) => {
                const name = value.match(/\s(.*?)\.svg/)[1];
                const svg = fs.readFileSync(`src/${name}.svg`, 'utf8');
                return result.replace(value, svg);
            },
            data
        );

        data = data.replace(
            /[\n\s]*\/\* style \*\//g,
            fs.readFileSync('css/style.css', 'utf8')
        );

        data = data.replace(
            /\/\* script \*\//g,
            fs.readFileSync('js/script.js', 'utf8')
        );

        fs.writeFile('index.html', data, 'utf8', (err) => {
            if (err) return console.log(err);
        });

        process.stdout.write(' ... Done.\n');
    } catch (e) {}
};
