import fs = require('fs');

const sections: {
    question: string;
    answers: { value: number; text: string }[];
}[] = JSON.parse(fs.readFileSync('./recruiters/sections.json', 'utf-8'));

const fitScore = process.argv[process.argv.length - 1];

fitScore
    .trim()
    .split('')
    .reverse()
    .forEach((n, index) => {
        const scoreValue = parseInt(n, 10) * Math.pow(10, index);

        let scoreText = '';

        sections.some((section) => {
            return section.answers.some(({ value, text }) => {
                if (scoreValue === value) {
                    return (scoreText = `\n${section.question}\n\n\t ${n}: ${text} \n`);
                }
            });
        });

        console.log(scoreText);
    });
