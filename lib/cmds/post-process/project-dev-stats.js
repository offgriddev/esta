"use strict";
/**
 * To gather developer statistics, we need first to have access to the jira issue
 * commit 02f78ac9e8792bdbf15b956712401665a47ebb85
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeveloperStatistics = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const commander_1 = require("commander");
const jira_1 = require("../../lib/jira");
const logger_1 = require("../lib/logger");
const fs_1 = require("../../lib/fs");
const dates_1 = require("../../lib/dates");
function findChangeLog(values, id) {
    const ids = id.split(',');
    for (const log of values) {
        const found = log.items.find(item => ids.includes(item.to));
        if (found)
            return log;
    }
    return {};
}
exports.getDeveloperStatistics = new commander_1.Command()
    .name('get-developer-stats')
    .alias('gds')
    .option('-S, --sha <sha>', 'Git SHA to use as the basis for analysis test case.')
    .option('-U, --jira-username <username>', 'Username for JIRA')
    .option('-P, --jira-password <password>', 'Password for JIRA')
    .option('-H, --jira-host <host>', 'Host for Jira account')
    .option('-E, --estimate-field <field>', 'Custom field where estimate is stored on model')
    .action(async (options) => {
    const data = await promises_1.default.readFile(`data/commit-metrics/${options.sha}.json`, 'utf-8');
    const metrics = JSON.parse(data);
    // if the commit is a merge into main, head will be undefined
    const isMainMerge = metrics.ref === 'refs/heads/main';
    if (!isMainMerge) {
        logger_1.logger.info(`SHA ${options.sha} is not for a merge into main. Can only calculate delivery on a final merge into main.`);
        return;
    }
    const jiraIssueKey = metrics.head.split('/')[1].replace('_', '-');
    const issueP = (0, jira_1.getIssue)({
        username: options.jiraUsername,
        password: options.jiraPassword,
        host: options.jiraHost,
        key: jiraIssueKey
    });
    const changelogP = (0, jira_1.getIssueChangelog)({
        username: options.jiraUsername,
        password: options.jiraPassword,
        host: options.jiraHost,
        key: jiraIssueKey
    });
    const [issue, changelog] = await Promise.all([issueP, changelogP]);
    const estimate = issue.fields[options.estimateField];
    const { created: startDate } = findChangeLog(changelog.values, '3,10071'); // needs to be options
    // get previous push to main and compare complexity
    const commits = await (0, fs_1.getCommitMetrics)();
    const filteredCommits = commits.filter(commit => commit.ref === 'refs/heads/main');
    const shaIndex = filteredCommits.findIndex(commit => commit.sha === metrics.sha);
    const commit = filteredCommits[shaIndex + 1];
    const result = {
        jiraKey: jiraIssueKey,
        commit: metrics.sha,
        author: metrics.actor,
        startDate,
        endDate: metrics.dateUtc,
        estimate,
        actual: metrics.totalComplexity - commit.totalComplexity,
        duration: (0, dates_1.getRealisticDuration)(startDate, metrics.dateUtc)
    };
    logger_1.logger.info(result);
});
