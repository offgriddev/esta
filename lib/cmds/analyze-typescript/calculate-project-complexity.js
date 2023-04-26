"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateProjectComplexityCommand = void 0;
const commander_1 = require("commander");
const logger_1 = require("../lib/logger");
const utils_1 = require("../../lib/utils");
exports.calculateProjectComplexityCommand = new commander_1.Command()
    .name('calculate-project-complexity')
    .alias('cpc')
    .argument('<dir>', 'Directory for analysis')
    .argument('<script-target>', 'Target ECMAScript Version, e.g. ES3, ES2022, ESNext')
    .action(async (dir, scriptTarget) => {
    const include = /\.ts$/;
    const exclude = /\.d.ts|__mocks__|.test.ts/;
    const sourceFiles = await (0, utils_1.getSourceFile)(dir, include, exclude);
    const result = await (0, utils_1.analyzeTypeScriptProject)(sourceFiles, scriptTarget || 'ES2018');
    logger_1.logger.info(result);
});
