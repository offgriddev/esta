#!/usr/bin/env node

import {Command} from 'commander'
import {calculateEstimate} from './calculate-estimate'
import {gatherMetrics} from './gather-metrics'
import {getEstimateProbability} from './get-estimate-propability'
import {calculateComplexityCommand} from './analyze-typescript/calculate-complexity'
import {calculateHalsteadCommand} from './analyze-typescript/calculate-halstead'
import {calculateCodeMetricsCommand} from './analyze-typescript/calculate-merge'
import {calculateProjectComplexityCommand} from './analyze-typescript/calculate-project-complexity'
import {analyzeCodeCommand} from './analyze-typescript/analyze'
import {printCommits} from './post-process/print-commits'
import {getMetricCommand} from './post-process/get-metric'
import {getDeveloperStatistics} from './post-process/project-dev-stats'

const program = new Command()
  .name('estamaton')
  .alias('esta')
  .description('A set of CLI tools to gather metrics on a codebase')
  .addCommand(gatherMetrics)
  .addCommand(calculateEstimate)
  .addCommand(getEstimateProbability)
  .addCommand(calculateComplexityCommand)
  .addCommand(calculateHalsteadCommand)
  .addCommand(calculateCodeMetricsCommand)
  .addCommand(calculateProjectComplexityCommand)
  .addCommand(analyzeCodeCommand)
  .addCommand(printCommits)
  .addCommand(getMetricCommand)
  .addCommand(getDeveloperStatistics)

program.parse()
