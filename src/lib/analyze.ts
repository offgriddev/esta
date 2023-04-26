import ts from 'typescript'
import {getSourceFile} from './utils'
import {analyzeTypeScript} from './harvest'
import { mkdir, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import { logger } from '../cmds/lib/logger'

export async function analyze(
  sha: string,
  actor: string,
  workingDirectory: string,
  scriptTarget: ts.ScriptTarget
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
    analysis,
    dateUtc: new Date().toISOString()
  }
  if (!existsSync(folder)) {
    await mkdir(folder)
  }
  await writeFile(filename, JSON.stringify(analytics, undefined, 2))

  logger.info(`complexity assessment written: ${filename}`)
  return filename
}
