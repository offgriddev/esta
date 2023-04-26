"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateComplexityCommand = void 0;
const commander_1 = require("commander");
const complexity_js_1 = require("../../lib/complexity.js");
const logger_js_1 = require("../lib/logger.js");
exports.calculateComplexityCommand = new commander_1.Command()
    .name('calculate-complexity')
    .alias('cc')
    .argument('<filename>', 'Filename for analysis')
    .argument('<script-target>', 'Target ECMAScript Version, e.g. ES3, ES2022, ESNext')
    .action(async (filename, scriptTarget) => {
    const result = await (0, complexity_js_1.calculateComplexity)(filename, scriptTarget || 'ES2018');
    logger_js_1.logger.info(result);
    const max = Object.values(result).reduce((prev, cur) => {
        return prev > cur ? prev : cur;
    }, 0);
    console.log(max);
});
