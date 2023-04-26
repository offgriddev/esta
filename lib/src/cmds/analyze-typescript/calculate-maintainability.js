"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMaintainabilityCommand = void 0;
const commander_1 = require("commander");
const maintainability_js_1 = require("./maintainability.js");
exports.calculateMaintainabilityCommand = new commander_1.Command()
    .name('calculate-maintainability')
    .alias('cm')
    .argument('<filename>', 'Filename for analysis')
    .argument('<script-target>', 'Target ECMAScript Version, e.g. ES3, ES2022, ESNext')
    .action(async (filename, scriptTarget) => {
    const result = await (0, maintainability_js_1.calculateMaintainability)(filename, scriptTarget || 'ES2018');
    logger.info(result);
});
