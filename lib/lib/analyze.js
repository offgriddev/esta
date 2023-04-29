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
async function analyze(workingDirectory, scriptTarget, token) {
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
    /**
     * get filenamess from diff, total up complexity of diff
     * get intersection between diff and analysis
     * add up the complexity of relevant files
     */
    const diff = await getDiff(token);
    const filenames = diff.map((d) => d.filename);
    const codebase = analysis.filter((file) => filenames.includes(file.source));
    const complexityDiff = codebase.map(({ metrics }) => {
        const metricKeys = Object.keys(metrics);
        let calc = 0;
        for (const key of metricKeys) {
            calc += metrics[key].complexity;
        }
        return calc;
    });
    const diffTotal = complexityDiff.reduce((prev, cur) => prev + cur);
    /**
     * Construct final model
     */
    const total = complexities.reduce((prev, cur) => +prev + +cur, 0);
    logger_1.logger.info(`total complexity ${total}`);
    const folder = 'complexity-assessment';
    const filename = `${folder}/${github_1.context.sha}.json`;
    const analytics = {
        totalComplexity: total,
        addedComplexity: diffTotal,
        sha: github_1.context.sha,
        actor: github_1.context.actor,
        ref: github_1.context.ref,
        head: github_1.context.payload.pull_request?.head.ref,
        actorId: github_1.context.payload.pull_request?.actor_id,
        repository: github_1.context.payload.pull_request?.repository,
        repositoryId: github_1.context.payload.repository_id,
        analysis,
        dateUtc: new Date().toISOString()
    };
    await (0, promises_1.mkdir)(folder);
    await (0, promises_1.writeFile)(filename, JSON.stringify(analytics, undefined, 2));
    logger_1.logger.info(`complexity assessment written: ${filename}`);
    return filename;
}
exports.analyze = analyze;
