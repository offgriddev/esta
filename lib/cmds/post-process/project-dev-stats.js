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
    const { created: startDate } = findChangeLog(changelog.values, '10071');
    // const {created} = changelog.values.find(({items}) =>
    //   items.find(item => item.to === '10071')
    // )
    const result = {
        startDate,
        originalEstimate: estimate
    };
});
