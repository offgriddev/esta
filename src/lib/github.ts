import {getOctokit} from '@actions/github'
export async function getHeadRefForPR(
  githubToken: string,
  pushCommitSha: string
): Promise<string | undefined> {
  const github = getOctokit(githubToken)
  const prs = await github.rest.pulls.list()
  const found = prs.data.find(pr => pr.merge_commit_sha === pushCommitSha)
  return found?.head.ref
}
