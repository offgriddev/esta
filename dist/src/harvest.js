"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeTypeScript = void 0;
const core = __importStar(require("@actions/core"));
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
        core.info(`${filename}: ${JSON.stringify(result, undefined, 2)}`);
        metrics.push({
            source: filename,
            metrics: result
        });
    }
    return metrics;
}
exports.analyzeTypeScript = analyzeTypeScript;
