import {Command} from 'commander'
import {logger} from '../lib/logger'
import {analyzeTypeScriptProject, getSourceFile} from '../../lib/utils'

export const calculateProjectComplexityCommand = new Command()
  .name('calculate-project-complexity')
  .alias('cpc')
  .argument('<dir>', 'Directory for analysis')
  .argument(
    '<script-target>',
    'Target ECMAScript Version, e.g. ES3, ES2022, ESNext'
  )
  .action(async (dir, scriptTarget) => {
    const include = /\.ts$/
    const exclude = /\.d.ts|__mocks__|.test.ts/
    const sourceFiles = await getSourceFile(dir, include, exclude)
    const result = await analyzeTypeScriptProject(
      sourceFiles,
      scriptTarget || 'ES2018'
    )

    logger.info(result)
  })
