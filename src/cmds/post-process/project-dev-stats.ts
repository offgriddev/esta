/**
 * To gather developer statistics, we need first to have access to the jira issue
 * commit be39d337d795f6b46458ebd692106ee6d3e02e09
 */

import fs from 'fs/promises'
import {Command} from 'commander'
import {CodeMetrics} from '../../lib/types'
import {ChangeLogItem, getIssue, getIssueChangelog} from '../../lib/jira'
import {logger} from '../lib/logger'

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

    // if the commit is a merge into main, head will be undefined
    const isMainMerge = metrics.ref === 'refs/heads/main'

    if (!isMainMerge) {
      logger.info(
        `SHA ${options.sha} is not for a merge into main. Can only calculate delivery on a final merge into main.`
      )
      return
    }

    async function findPrCommit(sha: string): Promise<CodeMetrics> {
      const dir = './data/commit-metrics'
      const files = await fs.readdir(dir)
      const contents: CodeMetrics[] = []
      for (const file of files) {
        const content = await fs.readFile(`${dir}/${file}.json`, 'utf-8')
        contents.push(JSON.parse(content))
      }
      const ordered = contents.sort((a, b) =>
        a.dateUtc === b.dateUtc ? 0 : a.dateUtc > b.dateUtc ? 1 : -1
      )
      const shaIndex = contents.findIndex(val => val.sha === sha)
      logger.info({ordered, shaIndex})
      // find previous commit by actor and
      // now, this may or may not be the originating commit.
      // may in the future need access to already computed commits
      return JSON.parse('{}')
    }

    const pr: CodeMetrics = await findPrCommit(options.sha)

    // this can be done through the push_event.commits...brilliant!
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
    const {created: startDate} = findChangeLog(changelog.values, '10071') // needs to be options
    // get files, parse, and sort by jira
    const result = {
      startDate,
      endDate: pr.dateUtc,
      estimate,
      duration: '' // from beginning to merge
    }
    logger.info(result)
  })
