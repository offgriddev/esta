/**
 * To gather developer statistics, we need first to have access to the jira issue
 * commit be39d337d795f6b46458ebd692106ee6d3e02e09
 */

import fs from 'fs/promises'
import {Command} from 'commander'
import {CodeMetrics} from '../../lib/types'
import * as JiraApi from 'jira-client'

type StatsParams = {
  sha: string
  jiraUsername: string
  jiraPassword: string
  jiraHost: string
  estimateField: string
}
export const getDeveloperStatistics = new Command()
  .name('get-developer-stats')
  .alias('gds')
  .option(
    '-S, --sha <sha>',
    'Git SHA to use as the basis for analysis test case.'
  )
  .option('-U, --jira-username <username>', 'Username for JIRA')
  .option('-P, --jira-password <password>', 'Password for JIRA')
  .option('-H, --jira-host <host>', 'Host for Jira account')
  .option(
    '-E, --estimate-field <field>',
    'Custom field where estimate is stored on model'
  )
  .action(async (options: StatsParam) => {
    const data = await fs.readFile(`data/${options.sha}.json`, 'utf-8')
    const metrics: CodeMetrics = JSON.parse(data)
    const jiraIssue = metrics.head.split('/')[1]
  })
