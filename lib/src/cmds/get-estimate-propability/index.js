"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEstimateProbability = void 0;
const commander_1 = require("commander");
const index_js_1 = require("../lib/index.js");
const promises_1 = require("fs/promises");
const sync_1 = require("csv/sync");
const columns = [
    'Summary',
    'Key',
    'StatusDate',
    'Labels',
    'EpicName',
    'EpicColor',
    'EpicLink',
    'Complexity'
];
exports.getEstimateProbability = new commander_1.Command()
    .name('get-estimate-probability')
    .alias('gep')
    .argument('<data>', 'location for export')
    .argument('<avg-speed>', 'Average hours (24hour cycle) to deliver 1 unit of complexity')
    .argument('<possible-hours>', 'Total possible hours in a given week (5 days = 120)')
    .argument('<number-of-devs>', 'Number of devs assigned to the project')
    .argument('<sample-size>', 'Amount of iterations')
    .description('Calculates estimates based on a Jira export')
    .action(async (data, avgSpeed, possibleHours, devCount, sampleSize) => {
    const contents = await (0, promises_1.readFile)(data, 'utf-8');
    const records = (0, sync_1.parse)(contents, { from_line: 2, columns });
    const estimatesInWeeks = [];
    logger.info(`Taking ${sampleSize} samples of a random distribution.`);
    for (let i = 0; i < sampleSize; i++) {
        const { weeks } = await (0, index_js_1.estimate)(records, avgSpeed, possibleHours, devCount);
        estimatesInWeeks.push(weeks.length);
    }
    // get results by count and percentage
    const average = estimatesInWeeks.reduce((prev, cur) => prev + cur, 0) /
        estimatesInWeeks.length;
    logger.info(`Average Estimate in Weeks: ${average}`);
    const uniques = [...new Set(estimatesInWeeks)];
    const percentageOfResults = [];
    for (const uniq of uniques) {
        const count = estimatesInWeeks.filter(x => x === uniq).length;
        const percentage = (count / estimatesInWeeks.length) * 100;
        percentageOfResults.push({ weeks: uniq, count, percentage });
    }
    logger.info(JSON.stringify(percentageOfResults, '', 2));
});
