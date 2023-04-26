"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHalsteadCommand = void 0;
const commander_1 = require("commander");
const halstead_1 = require("../../lib/halstead");
const logger_1 = require("../lib/logger");
exports.calculateHalsteadCommand = new commander_1.Command()
    .name('calculate-halstead')
    .alias('ch')
    .argument('<filename>', 'Filename for analysis')
    .argument('<script-target>', 'Target ECMAScript Version, e.g. ES3, ES2022, ESNext')
    .action(async (filename, scriptTarget) => {
    const result = await (0, halstead_1.calculateHalstead)(filename, scriptTarget || 'ES2018');
    logger_1.logger.info(JSON.stringify(result, undefined, 2));
});
