import ts from 'typescript'
import gh from '@actions/github'
import * as core from '@actions/core'
import {mkdir, writeFile} from 'fs/promises'
import {getSourceFile} from './utils'
import {analyzeTypeScript} from './harvest'
import { logger } from '../cmds/lib/logger'
import { GithubContext } from './types'

function getBranch(github: GithubContext): string {
  const client = gh.getOctokit(github.token)
  const key = github.ref.split('/')[1]
  const keyVal = github.ref.split('/')[2]
  const keyFunc = {
    // pull requests
    'pulls': async () => { 

      const pull = await client.rest.pulls.get({
        owner: github.repository_owner,
        repo: github.repository,
        pull_number: +keyVal,
        mediaType: {
          format: 'diff'
        }
      })
      core.info(JSON.stringify(pull, undefined, 2))
    }
  }[key]
  if (!keyFunc) {
    core.setFailed(`Could not find function to handle ${github.ref}`)
  }
  return ''
}
export async function analyze(
  workingDirectory: string,
  scriptTarget: ts.ScriptTarget,
  github: GithubContext
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
  const filename = `${folder}/${github.sha}.json`
  const branch = getBranch(github)
  const analytics = {
    totalComplexity: total,
    sha: github.sha,
    actor: github.actor,
    ref: github.ref,
    headRef: github.head_ref,
    actorId: github.actor_id,
    repository: github.repository,
    repositoryId: github.repository_id,
    branch,
    event: github.event,
    analysis,
    dateUtc: new Date().toISOString()
  }
  await mkdir(folder)
  await writeFile(filename, JSON.stringify(analytics, undefined, 2))

  logger.info(`complexity assessment written: ${filename}`)
  return filename
}
