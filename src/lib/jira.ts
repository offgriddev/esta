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
      } & Record<string, string>
    } & Record<string, number | string>
function getHeaders(
  username: string,
  password: string
): Record<string, string> {
  const creds = Buffer.from(`${username}:${password}`, 'utf-8').toString(
    'base64'
  )
  return {
    authorization: `Basic ${creds}`,
    'Content-Type': 'application/json',
    Accept: '*/*'
  }
}

export async function getIssue(config: GetIssueConfig): Promise<JiraIssue> {
  const headers = getHeaders(config.username, config.password)
  const url = `${config.host}/rest/api/3/issue/${config.key}`
  const res = await request(url, {
    headers
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
