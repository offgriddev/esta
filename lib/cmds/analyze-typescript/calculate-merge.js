"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCodeMetricsCommand = void 0;
const commander_1 = require("commander");
const halstead_1 = require("../../lib/halstead");
const complexity_1 = require("../../lib/complexity");
const lodash_mergewith_1 = __importDefault(require("lodash.mergewith"));
const logger_1 = require("../lib/logger");
exports.calculateCodeMetricsCommand = new commander_1.Command()
    .name('calculate-code-metrics')
    .alias('ccm')
    .argument('<filename>', 'Filename for analysis')
    .argument('<script-target>', 'Target ECMAScript Version, e.g. ES3, ES2022, ESNext')
    .action(async (filename, scriptTarget) => {
    const halsteadMetrics = await (0, halstead_1.calculateHalstead)(filename, scriptTarget || 'ES2018');
    const complexityMeasure = await (0, complexity_1.calculateComplexity)(filename, scriptTarget || 'ES2018');
    const result = (0, lodash_mergewith_1.default)(halsteadMetrics, complexityMeasure);
    logger_1.logger.info(JSON.stringify(result, undefined, 2));
});
