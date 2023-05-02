"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHeadRefForPR = void 0;
const github_1 = require("@actions/github");
const logger_1 = require("../cmds/lib/logger");
async function getHeadRefForPR(githubToken, event) {
    if (!event.commits)
        return undefined;
    const github = (0, github_1.getOctokit)(githubToken, github_1.context.repo);
    const prs = await github.rest.pulls.list({ ...github_1.context.repo, state: 'closed' });
    for (const commit of event.commits) {
        const found = prs.data.find(pr => pr.merge_commit_sha === commit.id);
        if (found)
            return found?.head.ref;
    }
    logger_1.logger.info('Found no PRs related to the commits in the PushEvent');
}
exports.getHeadRefForPR = getHeadRefForPR;
