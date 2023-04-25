"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeTypeScript = void 0;
const typescript_1 = __importDefault(require("typescript"));
const halstead_1 = require("./halstead");
const complexity_1 = require("./complexity");
const lodash_mergewith_1 = __importDefault(require("lodash.mergewith"));
// current support only ts
async function analyzeTypeScript(sourceFiles, scriptTarget) {
    const metrics = [];
    for (const filename of sourceFiles) {
        const halsteadMetrics = await (0, halstead_1.calculateHalstead)(filename, scriptTarget || typescript_1.default.ScriptTarget.ES2018);
        const complexityMeasure = await (0, complexity_1.calculateComplexity)(filename, scriptTarget || typescript_1.default.ScriptTarget.ES2018);
        const result = (0, lodash_mergewith_1.default)(halsteadMetrics, complexityMeasure);
        metrics.push({
            source: filename,
            metrics: result
        });
    }
    return metrics;
}
exports.analyzeTypeScript = analyzeTypeScript;
