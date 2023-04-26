import {Command} from 'commander'
import {analyzeTypeScriptProject, getSourceFile} from '../../lib/utils'
import {logger} from '../lib/logger'

export const gatherMetrics = new Command()
  .name('gather-metrics')
  .alias('gm')
  .argument('<dir>', 'directory to scan')
  .argument(
    '<script-target>',
    'Target ECMAScript Version, e.g. ES3, ES2022, ESNext'
  )
  .description('Allows you to gather metrics on a given codebase')
  .action(async (dir, scriptTarget) => {
    // get all the paths for files to evaluate

    const include = /\.ts/
    const exclude = /\.d.ts|__mocks__|.test.ts/
    const sourceFiles = await getSourceFile(dir, include, exclude)

    // get all source files
    // run analysis on source files
    const metrics = await analyzeTypeScriptProject(
      sourceFiles,
      scriptTarget || 'ES2021'
    )

    const complexities = metrics.map(({complexity}) => complexity)
    const total = complexities.reduce((prev, cur) => +prev + +cur, 0)
    logger.info(total)
  })
