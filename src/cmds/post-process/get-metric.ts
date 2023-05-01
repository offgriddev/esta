import {Command} from 'commander'
import fs from 'fs/promises'
import {logger} from '../lib/logger'

export const getMetricCommand = new Command()
  .name('get-metric')
  .alias('gmet')
  .option('-S, --sha <sha>', 'gitsha to print')
  .action(async options => {
    const content = await fs.readFile(
      `./data/commit-metrics/${options.sha}.json`,
      'utf-8'
    )
    logger.info(JSON.parse(content))
  })
