// script to process results stored in blob
import github from '@actions/github'
import {Command} from 'commander'
import fs from 'fs/promises'
import {CodeMetrics} from '../../lib/types'
import {logger} from '../lib/logger'

export const processMetrics = new Command()
  .name('process-metrics')
  .alias('pm')
  .argument('<github-token>', 'PAT or GITHUB_TOKEN')
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
      const octakit = github.getOctokit(token)
      octakit.rest.pulls.get()
    }
  })
