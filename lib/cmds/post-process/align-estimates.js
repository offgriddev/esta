"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.alignEstimates = void 0;
const commander_1 = require("commander");
const promises_1 = __importDefault(require("fs/promises"));
const logger_1 = require("../lib/logger");
// projects new metrics with original estimates in the cards
exports.alignEstimates = new commander_1.Command()
    .name('validate-estimate')
    .alias('pm')
    .argument('<github-token>', 'PAT or GITHUB_TOKEN')
    .argument('<jira-username>', 'Username for Jira')
    .argument('<jira-pat>', 'PAT for Jira')
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
        // get ticket from Jira
        // group commits by head branch
    }
});
