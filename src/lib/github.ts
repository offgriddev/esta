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
export type PushDetails = {head: string; actor: string; actorName: string}
export async function getPushDetails(
  githubToken: string,
  event: PushEvent
): Promise<PushDetails | undefined> {
  if (!event.commits) return undefined

  const github = getOctokit(githubToken, context.repo)
  // push always originates from a PR
  const prs = await github.rest.pulls.list({...context.repo, state: 'closed'})
  for (const commit of event.commits) {
    const found = prs.data.find(pr => pr.merge_commit_sha === commit.id)
    if (found)
      return {
        head: found.head.ref,
        actor: commit.author.username,
        actorName: commit.author.name
      }
  }
  logger.info('Found no PRs related to the commits in the PushEvent')
}
