import * as core from '@actions/core'
import {analyze} from '../lib/analyze'

async function run(): Promise<void> {
  try {
    const workingDirectory = core.getInput('working_directory') || './'
    const githubToken = core.getInput('github_token')
    const event = core.getInput('event')
    core.info(JSON.parse(event))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scriptTarget: any = core.getInput('ecma_script_target')
    const filename = await analyze(
      workingDirectory,
      scriptTarget,
      githubToken,
      event
    )

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
