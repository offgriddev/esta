import {Command} from 'commander'
import {calculateHalstead} from '../../lib/halstead'
import {calculateComplexity} from '../../lib/complexity'
import mergeWith from 'lodash.mergewith'
import {logger} from '../lib/logger'

export const calculateCodeMetricsCommand = new Command()
  .name('calculate-code-metrics')
  .alias('ccm')
  .argument('<filename>', 'Filename for analysis')
  .argument(
    '<script-target>',
    'Target ECMAScript Version, e.g. ES3, ES2022, ESNext'
  )
  .action(async (filename, scriptTarget) => {
    const halsteadMetrics = await calculateHalstead(
      filename,
      scriptTarget || 'ES2018'
    )
    const complexityMeasure = await calculateComplexity(
      filename,
      scriptTarget || 'ES2018'
    )
    const result = mergeWith(halsteadMetrics, complexityMeasure)
    logger.info(JSON.stringify(result, undefined, 2))
  })
