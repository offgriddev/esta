import {Command} from 'commander'
import {calculateHalstead} from './halstead.js'

export const calculateHalsteadCommand = new Command()
  .name('calculate-halstead')
  .alias('ch')
  .argument('<filename>', 'Filename for analysis')
  .argument(
    '<script-target>',
    'Target ECMAScript Version, e.g. ES3, ES2022, ESNext'
  )
  .action(async (filename, scriptTarget) => {
    const result = await calculateHalstead(filename, scriptTarget || 'ES2018')

    console.log(JSON.stringify(result, undefined, 2))
  })
