"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateComplexityCommand = void 0;
const commander_1 = require("commander");
const complexity_1 = require("../../lib/complexity");
const logger_1 = require("../lib/logger");
exports.calculateComplexityCommand = new commander_1.Command()
    .name('calculate-complexity')
    .alias('cc')
    .argument('<filename>', 'Filename for analysis')
    .argument('<script-target>', 'Target ECMAScript Version, e.g. ES3, ES2022, ESNext')
    .action(async (filename, scriptTarget) => {
    const result = await (0, complexity_1.calculateComplexity)(filename, scriptTarget || 'ES2018');
    logger_1.logger.info(result);
    const max = Object.values(result).reduce((prev, cur) => {
        return prev > cur ? prev : cur;
    }, 0);
    logger_1.logger.info(max);
});
