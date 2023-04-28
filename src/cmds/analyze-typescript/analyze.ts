import {Command} from 'commander'
import {analyze} from '../../lib/analyze'
import {GithubContext} from '../../lib/types'

export const analyzeCodeCommand = new Command()
  .name('analyze-for-action')
  .alias('afa')
  .argument('<dir>', 'Directory to scan')
  .argument(
    '<script-target>',
    'Target ECMAScript Version, e.g. ES3, ES2022, ESNext'
  )
  .action(async (dir, scriptTarget) => {
    await analyze(dir, scriptTarget, {} as GithubContext)
  })
