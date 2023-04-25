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
