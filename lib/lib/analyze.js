"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyze = void 0;
const promises_1 = require("fs/promises");
const utils_1 = require("./utils");
const harvest_1 = require("./harvest");
const logger_1 = require("../cmds/lib/logger");
const github_1 = require("@actions/github");
const github_2 = require("./github");
async function analyze(workingDirectory, scriptTarget, githubToken, event) {
    const include = /\.ts$/;
    const exclude = /\.d.ts|__mocks__|.test.ts/;
    const sourceFiles = await (0, utils_1.getSourceFile)(workingDirectory, include, exclude);
    const analysis = await (0, harvest_1.analyzeTypeScript)(sourceFiles, scriptTarget);
    const complexities = analysis.map(({ metrics }) => {
        const functions = Object.keys(metrics);
        const functionComplexity = functions.map(func => metrics[func].complexity);
        // axiom: the complexity of a module is the highest complexity of any of its functions
        const max = Object.values(functionComplexity).reduce((prev, cur) => {
            return prev > cur ? prev : cur;
        }, 0);
        return max;
    });
    /**
     * Construct final model
     */
    const total = complexities.reduce((prev, cur) => +prev + +cur, 0);
    logger_1.logger.info(`total complexity ${total}`);
    const folder = 'complexity-assessment';
    const filename = `${folder}/${github_1.context.sha}.json`;
    // get the first commit in the event, which should be the merge commit
    const baseMetrics = {
        totalComplexity: total,
        sha: github_1.context.sha,
        ref: github_1.context.ref,
        repository: github_1.context.repo,
        analysis,
        dateUtc: new Date().toISOString()
    };
    const prBase = {
        head: github_1.context.payload.pull_request?.head.ref,
        actor: github_1.context.actor
    };
    const pushBase = await (0, github_2.getPushDetails)(githubToken, event);
    // pull_request will be empty on a push
    const isPushRequest = !!pushBase;
    const analytics = isPushRequest
        ? {
            ...pushBase,
            ...baseMetrics
        }
        : { ...prBase, ...baseMetrics };
    await (0, promises_1.mkdir)(folder);
    await (0, promises_1.writeFile)(filename, JSON.stringify(analytics, undefined, 2));
    logger_1.logger.info(`complexity assessment written: ${filename}`);
    return filename;
}
exports.analyze = analyze;
