import {request} from 'undici'

type GetIssueConfig = {
  key: string
  username: string
  password: string
  host: string
}

type Resolution = {
  self: string
  id: number
  description: string
  name: string
}
type JiraIssue =
  | {
      id: string
      self: string
      key: string
      fields: {
        parent?: JiraIssue
        resolution: Resolution
      }
    } & Record<string, number | string>
function getHeaders(
  username: string,
  password: string
): Record<string, string> {
  return {
    Authentication: `Basic ${username}:${password}`,
    'Content-Type': 'application/json'
  }
}

export async function getIssue(config: GetIssueConfig): Promise<JiraIssue> {
  const res = await request(`${config.host}/rest/api/3/issue/${config.key}`, {
    headers: getHeaders(config.username, config.password)
  })

  return res.body.json()
}

export type FieldChange = {
  field: string
  fieldType: string
  from: number
  fromString: string
  to: string
  toString: string
}
type Author = {
  self: string
  accountId: string
  emailAddress: string
}
type ChangeLogAuthor = {
  id: string
  author: Author
  displayName: string
  active: boolean
  timeZone: string
  accountType: string
}

export type ChangeLogItem = {
  id: string
  author: ChangeLogAuthor
  created: string
  items: FieldChange[]
}
export type JiraIssueChangelog = {
  self: string
  maxResults: number
  startAt: number
  total: number
  isLast: boolean
  values: ChangeLogItem[]
}
export async function getIssueChangelog(
  config: GetIssueConfig
): Promise<JiraIssueChangelog> {
  const res = await request(
    `${config.host}/rest/api/3/issue/${config.key}/changelog`,
    {
      headers: getHeaders(config.username, config.password)
    }
  )

  return res.body.json()
}
