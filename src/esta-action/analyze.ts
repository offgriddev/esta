import * as core from '@actions/core'
import ts from 'typescript'
import {getSourceFile} from './utils'
import {analyzeTypeScript} from './harvest'
import {mkdir, writeFile} from 'fs/promises'

export async function analyze(
  sha: string,
  actor: string,
  workingDirectory: string,
  scriptTarget: ts.ScriptTarget
): Promise<string> {
  const include = /\.ts/
  const exclude = /\.d.ts|__mocks__|.test.ts/
  const sourceFiles = await getSourceFile(workingDirectory, include, exclude)
  const analysis = await analyzeTypeScript(sourceFiles, scriptTarget)

  const complexities = analysis.map(({metrics}) => metrics.complexity)
  const total = complexities.reduce((prev, cur) => +prev + +cur, 0)
  core.info(`total complexity ${total}`)
  const folder = 'complexity-assessment'
  const filename = `${folder}/${sha}.json`
  const analytics = {
    totalComplexity: total,
    sha,
    actor,
    analysis,
    dateUtc: new Date().toUTCString()
  }
  await mkdir(folder)
  await writeFile(filename, JSON.stringify(analytics, undefined, 2))

  core.info(`complexity assessment written: ${filename}`)
  return filename
}
