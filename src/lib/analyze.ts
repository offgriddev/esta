import ts from 'typescript'
import {mkdir, writeFile} from 'fs/promises'
import {getSourceFile} from './utils'
import {analyzeTypeScript} from './harvest'
import { logger } from '../cmds/lib/logger'
import {context} from '@actions/github'

export async function analyze(
  workingDirectory: string,
  scriptTarget: ts.ScriptTarget,
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

  /**
   * Construct final model
   */
  const total = complexities.reduce((prev, cur) => +prev + +cur, 0)
  logger.info(`total complexity ${total}`)
  const folder = 'complexity-assessment'
  const filename = `${folder}/${context.sha}.json`
  const analytics = {
    totalComplexity: total,
    sha: context.sha,
    actor: context.actor,
    ref: context.ref,
    head: context.payload.pull_request?.head.ref,
    actorId: context.payload.pull_request?.actor_id,
    repository: context.payload.pull_request?.repository,
    repositoryId: context.payload.repository_id,
    analysis,
    dateUtc: new Date().toISOString()
  }
  await mkdir(folder)
  await writeFile(filename, JSON.stringify(analytics, undefined, 2))

  logger.info(`complexity assessment written: ${filename}`)
  return filename
}
