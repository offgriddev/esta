import {Command} from 'commander'
import {calculateComplexity} from '../../lib/complexity'
import {logger} from '../lib/logger'

export const calculateComplexityCommand = new Command()
  .name('calculate-complexity')
  .alias('cc')
  .argument('<filename>', 'Filename for analysis')
  .argument(
    '<script-target>',
    'Target ECMAScript Version, e.g. ES3, ES2022, ESNext'
  )
  .action(async (filename, scriptTarget) => {
    const result = await calculateComplexity(filename, scriptTarget || 'ES2018')

    logger.info(result)
    //const max = Object.values(result).reduce((prev, cur) => {
    //  return (prev as number) > (cur.complexity as number) ? prev : cur
    //}, 0)
    //logger.info(max)
  })
