import {context, getOctokit} from '@actions/github'
import {logger} from '../cmds/lib/logger'

export type PushEvent = {
  commits: {
    id: string
    distinct: boolean
    message: string
    timestamp: string
    tree_id: string
    url: string
    author: {
      email: string
      name: string
      username: string
    }
    committer: {
      email: string
      name: string
      username: string
    }
  }[]
}
export async function getHeadRefForPR(
  githubToken: string,
  event: PushEvent
): Promise<string | undefined> {
  if (!event.commits) return undefined

  const github = getOctokit(githubToken, context.repo)
  const prs = await github.rest.pulls.list({...context.repo, state: 'closed'})
  for (const commit of event.commits) {
    const found = prs.data.find(pr => pr.merge_commit_sha === commit.id)
    if (found) return found?.head.ref
  }
  logger.info('Found no PRs related to the commits in the PushEvent')
}
