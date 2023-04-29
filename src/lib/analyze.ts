import ts from 'typescript'
import {mkdir, writeFile} from 'fs/promises'
import {getSourceFile} from './utils'
import {analyzeTypeScript} from './harvest'
import { logger } from '../cmds/lib/logger'
import { GithubContext } from './types'
import {context, getOctokit} from '@actions/github'

type GitFileDiff = {
    sha: string;
    filename: string;
    status: "added" | "removed" | "modified" | "renamed" | "copied" | "changed" | "unchanged";
    additions: number;
    deletions: number;
    changes: number;
    blob_url: string;
    raw_url: string;
    contents_url: string;
    patch?: string | undefined;
    previous_filename?: string | undefined;
}[] | undefined
async function getDiff(token: string): Promise<GitFileDiff> {
  if (token && context.payload.pull_request) {
    const octokit = getOctokit(token)

    const result = await octokit.rest.repos.compareCommits({
      repo: context.repo.repo,
      owner: context.repo.owner,
      head: context.payload.pull_request?.head.sha,
      base: context.payload.pull_request?.base.sha,
      per_page: 100
    })

    return result.data.files || []
  }

  return []
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
  const diff = await getDiff(github.token)
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
  const analytics = {
    totalComplexity: total,
    sha: github.sha,
    actor: github.actor,
    ref: github.ref,
    head: github.head_ref,
    actorId: github.actor_id,
    repository: github.repository,
    repositoryId: github.repository_id,
    analysis,
    diff,
    dateUtc: new Date().toISOString()
  }
  await mkdir(folder)
  await writeFile(filename, JSON.stringify(analytics, undefined, 2))

  logger.info(`complexity assessment written: ${filename}`)
  return filename
}
