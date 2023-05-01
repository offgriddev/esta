"use strict";
/**
 * To gather developer statistics, we need first to have access to the jira issue
 * commit be39d337d795f6b46458ebd692106ee6d3e02e09
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
exports.getDeveloperStatistics = new commander_1.Command()
    .name('get-developer-stats')
    .alias('gds')
    .option('-S, --sha <sha>', 'Git SHA to use as the basis for analysis test case.')
    .option('-U, --jira-username <username>', 'Username for JIRA')
    .option('-P, --jira-password <password>', 'Password for JIRA')
    .option('-H, --jira-host <host>', 'Host for Jira account')
    .option('-E, --estimate-field <field>', 'Custom field where estimate is stored on model')
    .action(async (options) => {
    const data = await promises_1.default.readFile(`data/${options.sha}.json`, 'utf-8');
    const metrics = JSON.parse(data);
    // the order is off here. We must first identify which sha is associated with
    // the commit related to the merge
    // this can be done through the push_event.commits...brilliant!
    const jiraIssueKey = metrics.head.split('/')[1];
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
    function findChangeLog(values, id) {
        for (const log of values) {
            const found = log.items.find(item => item.to === id);
            if (found)
                return log;
        }
        return {};
    }
    const [issue, changelog] = await Promise.all([issueP, changelogP]);
    const estimate = issue[options.estimateField];
    const { created: startDate } = findChangeLog(changelog.values, '10071'); // needs to be options
    // if the commit is a merge into main, head will be undefined
    const isMainMerge = metrics.ref === 'refs/heads/main';
    if (!isMainMerge) {
        logger_1.logger.info(`SHA ${options.sha} is not for a merge into main. Can only calculate delivery on a final merge into main.`);
        return;
    }
    async function findPrCommit(sha) {
        const dir = './data/commit-metrics';
        const files = await promises_1.default.readdir(dir);
        const contents = [];
        for (const file of files) {
            const content = await promises_1.default.readFile(`${dir}/${file}.json`, 'utf-8');
            contents.push(JSON.parse(content));
        }
        const ordered = contents.sort((a, b) => a.dateUtc === b.dateUtc ? 0 : a.dateUtc > b.dateUtc ? 1 : -1);
        const shaIndex = contents.findIndex(val => val.sha === sha);
        logger_1.logger.info({ ordered, shaIndex });
        // find previous commit by actor and
        // now, this may or may not be the originating commit.
        // may in the future need access to already computed commits
        return JSON.parse('{}');
    }
    const pr = await findPrCommit(options.sha);
    // get files, parse, and sort by jira
    const result = {
        startDate,
        endDate: pr.dateUtc,
        estimate,
        duration: '' // from beginning to merge
    };
    logger_1.logger.info(result);
});
