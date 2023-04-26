// import {Command} from 'commander'
// import {calculateMaintainability} from '../../lib/maintainability'
// import {logger} from '../lib/logger'
//
// export const calculateMaintainabilityCommand = new Command()
//   .name('calculate-maintainability')
//   .alias('cm')
//   .argument('<filename>', 'Filename for analysis')
//   .argument(
//     '<script-target>',
//     'Target ECMAScript Version, e.g. ES3, ES2022, ESNext'
//   )
//   .action(async (filename, scriptTarget) => {
//     const result = await calculateMaintainability(
//       filename,
//       scriptTarget || 'ES2018'
//     )
//
//     logger.info(result)
//   })
//
