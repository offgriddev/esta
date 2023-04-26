import {Command} from 'commander'
import {logger} from '../lib/logger'
import {analyze} from '../../lib/analyze'

export const analyzeCodeCommand = new Command()
  .name('analyze-for-action')
  .alias('afa')
  .argument('<dir>', 'Directory to scan')
  .argument(
    '<script-target>',
    'Target ECMAScript Version, e.g. ES3, ES2022, ESNext'
  )
  .action(async (dir, scriptTarget) => {
    await analyze('test', 'actor', dir, scriptTarget)
  })
