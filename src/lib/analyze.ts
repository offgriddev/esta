import ts from 'typescript'
import {mkdir, writeFile} from 'fs/promises'
import {getSourceFile} from './utils'
import {analyzeTypeScript} from './harvest'
import {logger} from '../cmds/lib/logger'
import {context} from '@actions/github'
import {CodeMetrics} from './types'
import {PushEvent, getHeadRefForPR} from './github'

export async function analyze(
  workingDirectory: string,
  scriptTarget: ts.ScriptTarget,
  githubToken: string,
  event: unknown
): Promise<string> {
  const include = /\.ts$/
  const exclude = /\.d.ts|__mocks__|.test.ts/
  const sourceFiles = await getSourceFile(workingDirectory, include, exclude)
  const analysis = await analyzeTypeScript(sourceFiles, scriptTarget)
  const complexities = analysis.map(({metrics}) => {
    const functions = Object.keys(metrics)
    const functionComplexity = functions.map(func => metrics[func].complexity)

    // axiom: the complexity of a module is the highest complexity of any of its functions
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

  // get the first commit in the event, which should be the merge commit

  const analytics: CodeMetrics = {
    totalComplexity: total,
    sha: context.sha,
    actor: context.actor,
    ref: context.ref,
    head:
      context.payload.pull_request?.head.ref ||
      (await getHeadRefForPR(githubToken, event as PushEvent)),
    repository: context.repo,
    analysis,
    dateUtc: new Date().toISOString()
  }
  await mkdir(folder)
  await writeFile(filename, JSON.stringify(analytics, undefined, 2))

  logger.info(`complexity assessment written: ${filename}`)
  return filename
}
