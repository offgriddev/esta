"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMetrics = void 0;
// script to process results stored in blob
const github_1 = __importDefault(require("@actions/github"));
const commander_1 = require("commander");
const promises_1 = __importDefault(require("fs/promises"));
const logger_1 = require("../lib/logger");
exports.processMetrics = new commander_1.Command()
    .name('process-metrics')
    .alias('pm')
    .argument('<github-token>', 'PAT or GITHUB_TOKEN')
    .action(async (token) => {
    /**
     * pull from local ./data
     * for each commit, pull in data for a jira ticket (if it doesn't exist) [multiple commits per jira ticket]
     * perform different analytical touchpoints
     * - developer speed
     * - project delivery speed
     * - pull jira information by ticket
     */
    const files = await promises_1.default.readdir('./data/commit-metrics');
    for (const file of files) {
        const content = await promises_1.default.readFile(file, 'utf-8');
        const report = JSON.parse(content);
        logger_1.logger.info(report);
        const octakit = github_1.default.getOctokit(token);
        octakit.rest.pulls.get();
    }
});
