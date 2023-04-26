import {Command} from 'commander'
import {getSourceFile} from '../lib/index.js'
import tscomplex from 'ts-complex'

// current support only ts
export function analyzeTypeScript(sourceFiles) {
  const metrics = []
  for (let s = 0; s < sourceFiles.length; s++) {
    const file = sourceFiles[s]
    const halstead = tscomplex.calculateCyclomaticComplexity(file)
    const complexity = halstead[Object.keys(halstead)[0]]
    if (!complexity) {
      logger.info(`${file}: 0`)
      continue
    }
    logger.info(`${file}: ${complexity}`)
    metrics.push({
      source: file,
      complexity
    })
  }

  return metrics
}

export const gatherMetrics = new Command()
  .name('gather-metrics')
  .alias('gm')
  .argument('<language>', 'JS and TS supported')
  .argument('<dir>', 'directory to scan')
  .description('Allows you to gather metrics on a given codebase')
  .action(async (language, dir) => {
    // get all the paths for files to evaluate

    const {include, exclude, analyze} = {
      ts: {
        include: /\.ts/,
        exclude: /\.d.ts|__mocks__|.test.ts/,
        analyze: analyzeTypeScript
      }
    }[language]
    const sourceFiles = await getSourceFile(dir, include, exclude)

    // get all source files
    // run analysis on source files
    const metrics = analyze(sourceFiles)

    const complexities = metrics.map(({complexity}) => complexity)
    const total = complexities.reduce((prev, cur) => +prev + +cur, 0)
    logger.info(total)
  })
