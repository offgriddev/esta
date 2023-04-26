"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateEstimate = void 0;
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
exports.calculateEstimate = new commander_1.Command()
    .name('calculate-estimate')
    .alias('ce')
    .argument('<data>', 'location for export')
    .argument('<avg-speed>', 'Average hours (24hour cycle) to deliver 1 unit of complexity')
    .argument('<possible-hours>', 'Total possible hours in a given week (5 days = 120)')
    .argument('<number-of-devs>', 'Number of devs assigned to the project')
    .description('Calculates estimates based on a Jira export')
    .action(async (data, avgSpeed, possibleHours, devCount, sampleSize) => {
    const contents = await (0, promises_1.readFile)(data, 'utf-8');
    const records = (0, sync_1.parse)(contents, { from_line: 2, columns });
    const { totalComplexity, weeks } = await (0, index_js_1.estimate)(records, avgSpeed, possibleHours, devCount);
    logger.info(JSON.stringify(weeks, '', 2));
    logger.info(`Total complexity to deliver: ${totalComplexity}`);
    logger.info(`Number of Devs: ${devCount}`);
    logger.info(`Average delivery speed for 1 unit of complexity (in hours): ${avgSpeed}`);
    logger.info(`Total hours possible per developer on project per week: ${possibleHours}, ${Math.round((possibleHours / 120) * 100)}% of a normal working week`);
    logger.info(`Total amount of weeks: ${weeks.length}`);
});
