import {getOctokit} from '@actions/github'

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
  const github = getOctokit(githubToken)
  const {commits} = event
  const prs = await github.rest.pulls.list()
  for (const commit of commits) {
    const found = prs.data.find(pr => pr.merge_commit_sha === commit.id)
    if (found) return found?.head.ref
  }
}
