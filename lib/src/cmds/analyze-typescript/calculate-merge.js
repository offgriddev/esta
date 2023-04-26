"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCodeMetricsCommand = void 0;
const commander_1 = require("commander");
const maintainability_js_1 = require("./maintainability.js");
const halstead_js_1 = require("./halstead.js");
const complexity_js_1 = require("./complexity.js");
const lodash_mergewith_1 = __importDefault(require("lodash.mergewith"));
exports.calculateCodeMetricsCommand = new commander_1.Command()
    .name('calculate-code-metrics')
    .alias('ccm')
    .argument('<filename>', 'Filename for analysis')
    .argument('<script-target>', 'Target ECMAScript Version, e.g. ES3, ES2022, ESNext')
    .action(async (filename, scriptTarget) => {
    const maintainabilityIndex = await (0, maintainability_js_1.calculateMaintainability)(filename, scriptTarget || 'ES2018');
    const halsteadMetrics = await (0, halstead_js_1.calculateHalstead)(filename, scriptTarget || 'ES2018');
    const complexityMeasure = await (0, complexity_js_1.calculateComplexity)(filename, scriptTarget || 'ES2018');
    const result = (0, lodash_mergewith_1.default)(maintainabilityIndex, halsteadMetrics, complexityMeasure);
    logger.info(JSON.stringify(result, undefined, 2));
});
