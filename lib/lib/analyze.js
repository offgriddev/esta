"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyze = void 0;
const promises_1 = require("fs/promises");
const utils_1 = require("./utils");
const harvest_1 = require("./harvest");
const logger_1 = require("../cmds/lib/logger");
const github_1 = require("@actions/github");
async function analyze(workingDirectory, scriptTarget) {
    const include = /\.ts$/;
    const exclude = /\.d.ts|__mocks__|.test.ts/;
    const sourceFiles = await (0, utils_1.getSourceFile)(workingDirectory, include, exclude);
    const analysis = await (0, harvest_1.analyzeTypeScript)(sourceFiles, scriptTarget);
    const complexities = analysis.map(({ metrics }) => {
        const functions = Object.keys(metrics);
        const functionComplexity = functions.map(func => metrics[func].complexity);
        // total these up
        return functionComplexity.reduce((prev, cur) => +prev + +cur, 0);
    });
    /**
     * Construct final model
     */
    const total = complexities.reduce((prev, cur) => +prev + +cur, 0);
    logger_1.logger.info(`total complexity ${total}`);
    const folder = 'complexity-assessment';
    const filename = `${folder}/${github_1.context.sha}.json`;
    const analytics = {
        totalComplexity: total,
        sha: github_1.context.sha,
        actor: github_1.context.actor,
        ref: github_1.context.ref,
        head: github_1.context.payload.pull_request?.head.ref,
        repository: github_1.context.repo,
        analysis,
        dateUtc: new Date().toISOString()
    };
    await (0, promises_1.mkdir)(folder);
    await (0, promises_1.writeFile)(filename, JSON.stringify(analytics, undefined, 2));
    logger_1.logger.info(`complexity assessment written: ${filename}`);
    return filename;
}
exports.analyze = analyze;
