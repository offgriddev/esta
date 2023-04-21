import core from '@actions/core'
import {getSourceFile} from './utils'
import {analyzeTypeScript} from './harvest'
import {mkdir, writeFile} from 'fs/promises'

export async function analyze(
  sha: string,
  actor: string,
  workingDirectory: string
): Promise<string> {
  core.debug(`inputs: ${sha} ${actor} ${workingDirectory}`)
  const include = /\.ts/
  const exclude = /\.d.ts|__mocks__|.test.ts/
  const sourceFiles = await getSourceFile(workingDirectory, include, exclude)
  const metrics = analyzeTypeScript(sourceFiles)

  const complexities = metrics.map(({complexity}) => complexity)
  const total = complexities.reduce((prev, cur) => +prev + +cur, 0)
  core.info(`total complexity ${total}`)
  const folder = 'complexity-assessment'
  const filename = `${folder}/${sha}.json`
  const analytics = {
    totalComplexity: total,
    sha,
    actor,
    metrics,
    dateUtc: new Date().toUTCString()
  }
  await mkdir(folder)
  await writeFile(filename, JSON.stringify(analytics, undefined, 2))

  core.info(`complexity assessment written: ${filename}`)
  return filename
}
