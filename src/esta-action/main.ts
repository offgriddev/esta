import * as core from '@actions/core'
import {analyze} from './analyze'

async function run(): Promise<void> {
  try {
    const sha = core.getInput('sha')
    const actor = core.getInput('actor')
    const workingDirectory = core.getInput('working_directory')
    const filename = analyze(sha, actor, workingDirectory)
    core.setOutput('export_filename', filename)
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
