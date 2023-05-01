import {Command} from 'commander'
import fs from 'fs/promises'
import {CodeMetrics} from '../../lib/types'
import {logger} from '../lib/logger'

export const printCommits = new Command()
  .name('print-commits')
  .alias('pc')
  .action(async () => {
    const directory = './data/commit-metrics'
    const files = await fs.readdir(directory)
    const content: CodeMetrics[] = []
    for (const file of files) {
      const fileContent = await fs.readFile(`${directory}/${file}`, 'utf-8')
      content.push(JSON.parse(fileContent))
    }

    const items = content.sort((a, b) =>
      a.dateUtc === b.dateUtc ? 0 : a.dateUtc > b.dateUtc ? 1 : -1
    )
    for (const {sha, actor, head, ref, totalComplexity, dateUtc} of items) {
      logger.info({
        sha,
        actor,
        head,
        ref,
        totalComplexity,
        dateUtc
      })
    }
  })
