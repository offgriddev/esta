import {Command} from 'commander'
import {calculateComplexity} from './complexity.js'

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

    console.log(result)
    const max = Object.values(result).reduce((prev, cur) => {
      return prev > cur ? prev : cur
    }, 0)
    console.log(max)
  })
