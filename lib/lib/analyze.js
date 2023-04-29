"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyze = void 0;
const promises_1 = require("fs/promises");
const utils_1 = require("./utils");
const harvest_1 = require("./harvest");
const logger_1 = require("../cmds/lib/logger");
const github_1 = require("@actions/github");
async function getDiff(token) {
    if (token && github_1.context.payload.pull_request) {
        const octokit = (0, github_1.getOctokit)(token);
        const result = await octokit.rest.repos.compareCommits({
            repo: github_1.context.repo.repo,
            owner: github_1.context.repo.owner,
            head: github_1.context.payload.pull_request?.head.sha,
            base: github_1.context.payload.pull_request?.base.sha,
            per_page: 100
        });
        return result.data.files || [];
    }
    return [];
}
async function analyze(workingDirectory, scriptTarget, github) {
    const include = /\.ts$/;
    const exclude = /\.d.ts|__mocks__|.test.ts/;
    const sourceFiles = await (0, utils_1.getSourceFile)(workingDirectory, include, exclude);
    const analysis = await (0, harvest_1.analyzeTypeScript)(sourceFiles, scriptTarget);
    const diff = await getDiff(github.token);
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
    const analytics = {
        totalComplexity: total,
        sha: github.sha,
        actor: github.actor,
        ref: github.ref,
        head: github.head_ref,
        actorId: github.actor_id,
        repository: github.repository,
        repositoryId: github.repository_id,
        analysis,
        diff,
        dateUtc: new Date().toISOString()
    };
    await (0, promises_1.mkdir)(folder);
    await (0, promises_1.writeFile)(filename, JSON.stringify(analytics, undefined, 2));
    logger_1.logger.info(`complexity assessment written: ${filename}`);
    return filename;
}
exports.analyze = analyze;
