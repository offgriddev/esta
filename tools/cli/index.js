#!/usr/bin/env node

import {Command} from 'commander'
import {calculateEstimate} from './calculate-estimate/index.js'
import {gatherMetrics} from './gather-metrics/index.js'
import {getEstimateProbability} from './get-estimate-propability/index.js'
import {printGithubContext} from './github-analytics/index.js'

const program = new Command()
  .name('estamaton')
  .alias('esta')
  .description('A set of CLI tools to gather metrics on a codebase')
  .addCommand(gatherMetrics)
  .addCommand(calculateEstimate)
  .addCommand(getEstimateProbability)
  .addCommand(printGithubContext)

await program.parseAsync()
