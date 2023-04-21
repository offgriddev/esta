import {Command} from 'commander'
import {calculateMaintainability} from './maintainability.js'
import {calculateHalstead} from './halstead.js'
import {calculateComplexity} from './complexity.js'
import mergeWith from 'lodash.mergewith'

export const calculateCodeMetricsCommand = new Command()
  .name('calculate-code-metrics')
  .alias('ccm')
  .argument('<filename>', 'Filename for analysis')
  .argument(
    '<script-target>',
    'Target ECMAScript Version, e.g. ES3, ES2022, ESNext'
  )
  .action(async (filename, scriptTarget) => {
    const maintainabilityIndex = await calculateMaintainability(
      filename,
      scriptTarget || 'ES2018'
    )
    const halsteadMetrics = await calculateHalstead(
      filename,
      scriptTarget || 'ES2018'
    )
    const complexityMeasure = await calculateComplexity(
      filename,
      scriptTarget || 'ES2018'
    )
    const result = mergeWith(
      maintainabilityIndex,
      halsteadMetrics,
      complexityMeasure
    )
    console.log(JSON.stringify(result, undefined, 2))
  })
