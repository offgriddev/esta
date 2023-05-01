export type HalsteadMetrics =
  | {
      length: number
      vocabulary: number
      volume: number
      difficulty: number
      effort: number
      time: number
      bugsDelivered: number
      operands: OperationMetrics
    }
  | {}
  | Record<string, unknown>

export type OpExpression = {
  total: number
  _unique: Set<string | number>
  unique: number
}

export type OperationMetrics = {
  operands: OpExpression
  operators: OpExpression
}

export type ProjectTaskData = {
  Complexity: string
  EpicLink: string
  Key: string
  total: number
  fact: number
}

export type Player = {
  name: string
  weeks: Record<number, PlayerWeek[]>
}

export type Card = {
    complexity: number;
    key: string;
}

export type EstimateEvidence = {
  total: number,
  cards: Card[] 
}

export type PlayerCardAssignment = {
  workable: number
  overage: number
}

export type PlayerWeek = {
  hours: number
  player: string
  epic: string
}

export type Estimate = {
  totalComplexity: number
  weeks: PlayerWeek[][]
}

export type Metric = {
  source: string
  complexity: number
}

export type CodeMetrics = {
  totalComplexity: number
  sha: string
  actor: string
  head: string
  repository: { owner: string; repo: string; }
  ref: string
  analysis: ComplexityResult[]
  dateUtc: string
}

export type ComplexityResult = {
  source: string
  metrics: Record<string, HalsteadMetrics & {complexity: number}>
}