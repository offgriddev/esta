"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gatherMetrics = exports.analyzeTypeScript = void 0;
const commander_1 = require("commander");
const index_js_1 = require("../lib/index.js");
const ts_complex_1 = __importDefault(require("ts-complex"));
// current support only ts
function analyzeTypeScript(sourceFiles) {
    const metrics = [];
    for (let s = 0; s < sourceFiles.length; s++) {
        const file = sourceFiles[s];
        const halstead = ts_complex_1.default.calculateCyclomaticComplexity(file);
        const complexity = halstead[Object.keys(halstead)[0]];
        if (!complexity) {
            logger.info(`${file}: 0`);
            continue;
        }
        logger.info(`${file}: ${complexity}`);
        metrics.push({
            source: file,
            complexity
        });
    }
    return metrics;
}
exports.analyzeTypeScript = analyzeTypeScript;
exports.gatherMetrics = new commander_1.Command()
    .name('gather-metrics')
    .alias('gm')
    .argument('<language>', 'JS and TS supported')
    .argument('<dir>', 'directory to scan')
    .description('Allows you to gather metrics on a given codebase')
    .action(async (language, dir) => {
    // get all the paths for files to evaluate
    const { include, exclude, analyze } = {
        ts: {
            include: /\.ts/,
            exclude: /\.d.ts|__mocks__|.test.ts/,
            analyze: analyzeTypeScript
        }
    }[language];
    const sourceFiles = await (0, index_js_1.getSourceFile)(dir, include, exclude);
    // get all source files
    // run analysis on source files
    const metrics = analyze(sourceFiles);
    const complexities = metrics.map(({ complexity }) => complexity);
    const total = complexities.reduce((prev, cur) => +prev + +cur, 0);
    logger.info(total);
});
