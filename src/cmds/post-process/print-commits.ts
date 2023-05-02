import {Command} from 'commander'
import {getCommitMetrics} from '../../lib/fs'

export const printCommits = new Command()
  .name('print-commits')
  .alias('pc')
  .action(async () => {
    const items = await getCommitMetrics()
    const slim: any[] = []
    for (const {sha, actor, head, ref, totalComplexity, dateUtc} of items) {
      slim.push({
        sha,
        actor,
        head,
        ref,
        totalComplexity,
        dateUtc
      })
    }
    console.table(slim)
  })
