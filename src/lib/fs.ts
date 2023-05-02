import fs from 'fs/promises'
import {CodeMetrics} from './types'

export async function getCommitMetrics(): Promise<CodeMetrics[]> {
  const directory = './data/commit-metrics'
  const files = await fs.readdir(directory)
  const content: CodeMetrics[] = []
  for (const file of files) {
    const fileContent = await fs.readFile(`${directory}/${file}`, 'utf-8')
    content.push(JSON.parse(fileContent))
  }

  return content.sort((a, b) =>
    a.dateUtc === b.dateUtc ? 0 : a.dateUtc < b.dateUtc ? 1 : -1
  )
}
