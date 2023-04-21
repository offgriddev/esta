import * as core from '@actions/core'
import ts from 'typescript'
import mergeWith from 'lodash.mergewith'
import {analyze} from './analyze'
import {calculateHalstead} from './halstead'

async function run(): Promise<void> {
  try {
    const sha = core.getInput('sha')
    const actor = core.getInput('actor')
    const workingDirectory = core.getInput('working_directory')
    const scriptTarget: any = core.getInput('script_target')
    const filename = analyze(sha, actor, workingDirectory, scriptTarget)

    core.setOutput('export_filename', filename)
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
