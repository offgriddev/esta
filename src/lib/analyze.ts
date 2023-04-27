import ts from 'typescript'
import {getSourceFile} from './utils'
import {analyzeTypeScript} from './harvest'
import {mkdir, writeFile} from 'fs/promises'
import { logger } from '../cmds/lib/logger'

export async function analyze(
  sha: string,
  actor: string,
  workingDirectory: string,
  scriptTarget: ts.ScriptTarget,
  branch: string
): Promise<string> {
  const include = /\.ts$/
  const exclude = /\.d.ts|__mocks__|.test.ts/
  const sourceFiles = await getSourceFile(workingDirectory, include, exclude)
  const analysis = await analyzeTypeScript(sourceFiles, scriptTarget)

  const complexities = analysis.map(({metrics}) => {
    const functions = Object.keys(metrics)
    const functionComplexity = functions.map(func => metrics[func].complexity)
    const max = Object.values(functionComplexity).reduce((prev, cur) => {
      return prev > cur ? prev : cur
    }, 0)
    return max
  })

  const total = complexities.reduce((prev, cur) => +prev + +cur, 0)
  logger.info(`total complexity ${total}`)
  const folder = 'complexity-assessment'
  const filename = `${folder}/${sha}.json`
  const analytics = {
    totalComplexity: total,
    sha,
    actor,
    branch,
    analysis,
    dateUtc: new Date().toISOString()
  }
  await mkdir(folder)
  await writeFile(filename, JSON.stringify(analytics, undefined, 2))

  logger.info(`complexity assessment written: ${filename}`)
  return filename
}
