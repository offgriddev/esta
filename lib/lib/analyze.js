"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyze = void 0;
const utils_1 = require("./utils");
const harvest_1 = require("./harvest");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const logger_1 = require("../cmds/lib/logger");
async function analyze(sha, actor, workingDirectory, scriptTarget) {
    const include = /\.ts$/;
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
    logger_1.logger.info(`total complexity ${total}`);
    const folder = 'complexity-assessment';
    const filename = `${folder}/${sha}.json`;
    const analytics = {
        totalComplexity: total,
        sha,
        actor,
        analysis,
        dateUtc: new Date().toISOString()
    };
    if (!(0, fs_1.existsSync)(folder)) {
        await (0, promises_1.mkdir)(folder);
    }
    await (0, promises_1.writeFile)(filename, JSON.stringify(analytics, undefined, 2));
    logger_1.logger.info(`complexity assessment written: ${filename}`);
    return filename;
}
exports.analyze = analyze;
