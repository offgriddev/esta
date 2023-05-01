/**
 * To gather developer statistics, we need first to have access to the jira issue
 * commit be39d337d795f6b46458ebd692106ee6d3e02e09
 */

import fs from 'fs/promises'
import {Command} from 'commander'
import {CodeMetrics} from '../../lib/types'
import {ChangeLogItem, getIssue, getIssueChangelog} from '../../lib/jira'

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
  .action(async (options: StatsParams) => {
    const data = await fs.readFile(`data/${options.sha}.json`, 'utf-8')
    const metrics: CodeMetrics = JSON.parse(data)
    const jiraIssueKey = metrics.head.split('/')[1]
    const issueP = getIssue({
      username: options.jiraUsername,
      password: options.jiraPassword,
      host: options.jiraHost,
      key: jiraIssueKey
    })
    const changelogP = getIssueChangelog({
      username: options.jiraUsername,
      password: options.jiraPassword,
      host: options.jiraHost,
      key: jiraIssueKey
    })
    function findChangeLog(values: ChangeLogItem[], id: string): ChangeLogItem {
      for (const log of values) {
        const found = log.items.find(item => item.to === id)
        if (found) return log
      }
      return {} as ChangeLogItem
    }
    const [issue, changelog] = await Promise.all([issueP, changelogP])
    const estimate = issue[options.estimateField]
    const {created: startDate} = findChangeLog(changelog.values, '10071')
    // const {created} = changelog.values.find(({items}) =>
    //   items.find(item => item.to === '10071')
    // )

    const result = {
      startDate,
      originalEstimate: estimate
    }
  })
