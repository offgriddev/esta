import {Command} from 'commander'
import {calculateMaintainability} from './maintainability.js'

export const calculateMaintainabilityCommand = new Command()
  .name('calculate-maintainability')
  .alias('cm')
  .argument('<filename>', 'Filename for analysis')
  .argument(
    '<script-target>',
    'Target ECMAScript Version, e.g. ES3, ES2022, ESNext'
  )
  .action(async (filename, scriptTarget) => {
    const result = await calculateMaintainability(
      filename,
      scriptTarget || 'ES2018'
    )

    console.log(result)
  })
