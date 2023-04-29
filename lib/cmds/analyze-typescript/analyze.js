"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeCodeCommand = void 0;
const commander_1 = require("commander");
const analyze_1 = require("../../lib/analyze");
exports.analyzeCodeCommand = new commander_1.Command()
    .name('analyze-for-action')
    .alias('afa')
    .argument('<dir>', 'Directory to scan')
    .argument('<script-target>', 'Target ECMAScript Version, e.g. ES3, ES2022, ESNext')
    .action(async (dir, scriptTarget) => {
    await (0, analyze_1.analyze)(dir, scriptTarget);
});
