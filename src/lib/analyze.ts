import ts from 'typescript'
import {mkdir, writeFile} from 'fs/promises'
import {getSourceFile} from './utils'
import {analyzeTypeScript} from './harvest'
import { logger } from '../cmds/lib/logger'
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
}[]
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
  token: string
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
   * get filenamess from diff, total up complexity of diff
   * get intersection between diff and analysis
   * add up the complexity of relevant files
   */
  const diff = await getDiff(token)
  const filenames = diff.map((d) => d.filename)
  const codebase = analysis.filter((file) => filenames.includes(file.source))
  const complexityDiff = codebase.map(({ metrics }) => {
    const metricKeys = Object.keys(metrics)
    let calc = 0
    for (const key of metricKeys) {
      calc += metrics[key].complexity
    }
    return calc
  })
  const diffTotal = complexityDiff.reduce((prev, cur) => prev + cur)

  /**
   * Construct final model
   */
  const total = complexities.reduce((prev, cur) => +prev + +cur, 0)
  logger.info(`total complexity ${total}`)
  const folder = 'complexity-assessment'
  const filename = `${folder}/${context.sha}.json`
  const analytics = {
    totalComplexity: total,
    addedComplexity: diffTotal,
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
