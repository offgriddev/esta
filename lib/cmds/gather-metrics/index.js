"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gatherMetrics = void 0;
const commander_1 = require("commander");
const utils_1 = require("../../lib/utils");
const logger_1 = require("../lib/logger");
exports.gatherMetrics = new commander_1.Command()
    .name('gather-metrics')
    .alias('gm')
    .argument('<dir>', 'directory to scan')
    .argument('<script-target>', 'Target ECMAScript Version, e.g. ES3, ES2022, ESNext')
    .description('Allows you to gather metrics on a given codebase')
    .action(async (dir, scriptTarget) => {
    // get all the paths for files to evaluate
    const include = /\.ts/;
    const exclude = /\.d.ts|__mocks__|.test.ts/;
    const sourceFiles = await (0, utils_1.getSourceFile)(dir, include, exclude);
    // get all source files
    // run analysis on source files
    const metrics = await (0, utils_1.analyzeTypeScriptProject)(sourceFiles, scriptTarget || 'ES2021');
    const complexities = metrics.map(({ complexity }) => complexity);
    const total = complexities.reduce((prev, cur) => +prev + +cur, 0);
    logger_1.logger.info(total);
});
