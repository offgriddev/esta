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
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyze = void 0;
const core = __importStar(require("@actions/core"));
const utils_1 = require("./utils");
const harvest_1 = require("./harvest");
const promises_1 = require("fs/promises");
async function analyze(sha, actor, workingDirectory, scriptTarget) {
    const include = /\.ts/;
    const exclude = /\.d.ts|__mocks__|.test.ts/;
    const sourceFiles = await (0, utils_1.getSourceFile)(workingDirectory, include, exclude);
    const analysis = await (0, harvest_1.analyzeTypeScript)(sourceFiles, scriptTarget);
    const complexities = analysis.map(({ metrics }) => {
        const functions = Object.keys(metrics);
        const functionComplexity = functions.map(func => metrics[func].complexity);
        const max = Object.values(functionComplexity).reduce((prev, cur) => {
            return prev > cur ? prev : cur;
        }, 0);
        return max;
    });
    const total = complexities.reduce((prev, cur) => +prev + +cur, 0);
    core.info(`total complexity ${total}`);
    const folder = 'complexity-assessment';
    const filename = `${folder}/${sha}.json`;
    const analytics = {
        totalComplexity: total,
        sha,
        actor,
        analysis,
        dateUtc: new Date().toUTCString()
    };
    await (0, promises_1.mkdir)(folder);
    await (0, promises_1.writeFile)(filename, JSON.stringify(analytics, undefined, 2));
    core.info(`complexity assessment written: ${filename}`);
    return filename;
}
exports.analyze = analyze;
