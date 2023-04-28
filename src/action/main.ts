import * as core from '@actions/core'
import {analyze} from '../lib/analyze'
import {GithubContext} from '../lib/types'
import {context, getOctokit} from '@actions/github'

async function getDiff(token) {
  if (token && context.payload.pull_request) {
    const octokit = getOctokit(token)

    const result = await octokit.rest.repos.compareCommits({
      repo: context.repo.repo,
      owner: context.repo.owner,
      head: context.payload.pull_request.head.sha,
      base: context.payload.pull_request.base.sha,
      per_page: 100
    })

    return result.data.files || []
  }

  return []
}

async function run(): Promise<void> {
  try {
    const githubContext = core.getInput('context')
    const github: GithubContext = JSON.parse(githubContext)

    const workingDirectory = core.getInput('working_directory') || './'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scriptTarget: any = core.getInput('ecma_script_target')
    const filename = await analyze(workingDirectory, scriptTarget, github)

    core.info(JSON.stringify(context, undefined, 2))
    const diff = await getDiff(github.token)
    core.info(JSON.stringify(diff, undefined, 2))
    // get the files and functions that were modified by the actor
    // get complexity diff
    // get min, max, mean, avg for halstead metrics
    // get min, max, mean, avg for complexity
    core.setOutput('export_filename', filename)
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
