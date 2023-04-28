"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyze = void 0;
const promises_1 = require("fs/promises");
const utils_1 = require("./utils");
const harvest_1 = require("./harvest");
const logger_1 = require("../cmds/lib/logger");
function getBranch(github) {
    const key = github.ref.split('/')[1];
    return key === 'pull' ? github.event.pull_request.head.label : github.ref;
}
async function analyze(workingDirectory, scriptTarget, github) {
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
    const filename = `${folder}/${github.sha}.json`;
    const branch = getBranch(github);
    const analytics = {
        totalComplexity: total,
        sha: github.sha,
        actor: github.actor,
        ref: github.ref,
        headRef: github.head_ref,
        actorId: github.actor_id,
        repository: github.repository,
        repositoryId: github.repository_id,
        head: branch,
        analysis,
        dateUtc: new Date().toISOString()
    };
    await (0, promises_1.mkdir)(folder);
    await (0, promises_1.writeFile)(filename, JSON.stringify(analytics, undefined, 2));
    logger_1.logger.info(`complexity assessment written: ${filename}`);
    return filename;
}
exports.analyze = analyze;
