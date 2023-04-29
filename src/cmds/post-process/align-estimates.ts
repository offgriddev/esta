import {Command} from 'commander'
import fs from 'fs/promises'
import {CodeMetrics} from '../../lib/types'
import {logger} from '../lib/logger'

// projects new metrics with original estimates in the cards
export const alignEstimates = new Command()
  .name('validate-estimate')
  .alias('pm')
  .argument('<github-token>', 'PAT or GITHUB_TOKEN')
  .argument('<jira-username>', 'Username for Jira')
  .argument('<jira-pat>', 'PAT for Jira')
  .action(async token => {
    /**
     * pull from local ./data
     * for each commit, pull in data for a jira ticket (if it doesn't exist) [multiple commits per jira ticket]
     * perform different analytical touchpoints
     * - developer speed
     * - project delivery speed
     * - pull jira information by ticket
     */

    const files = await fs.readdir('./data/commit-metrics')
    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8')
      const report: CodeMetrics = JSON.parse(content)
      logger.info(report)
      // get ticket from Jira
      // group commits by head branch
    }
  })
