import * as core from '@actions/core'
import {analyze} from '../lib/analyze'
import {context} from '@actions/github'

async function run(): Promise<void> {
  try {
    const workingDirectory = core.getInput('working_directory') || './'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scriptTarget: any = core.getInput('ecma_script_target')
    const filename = await analyze(workingDirectory, scriptTarget)

    core.info(JSON.stringify(context, undefined, 2))
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
