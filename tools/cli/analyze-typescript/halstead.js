import ts from 'typescript'
import {readFile} from 'fs/promises'
import {
  getName,
  isFunctionWithBody,
  getOperatorsAndOperands
} from './parse-ast.js'

const getHalstead = node => {
  if (isFunctionWithBody(node)) {
    const {operands, operators} = getOperatorsAndOperands(node)
    const length = operands.total + operators.total
    const vocabulary = operands.unique + operators.unique

    // If legnth is 0, all other values will be NaN
    if (length === 0 || vocabulary === 1) return {}

    const volume = length * Math.log2(vocabulary)
    const difficulty =
      (operators.unique / 2) * (operands.total / operands.unique)
    const effort = volume * difficulty
    const time = effort / 18
    const bugsDelivered = effort ** (2 / 3) / 3000

    return {
      length,
      vocabulary,
      volume,
      difficulty,
      effort,
      time,
      bugsDelivered,
      operands,
      operators
    }
  }
  return {}
}

// Returns the halstead volume for a function
// If passed node is not a function, returns empty object
const calculateFromSource = ctx => {
  const output = {}
  ts.forEachChild(ctx, function cb(node) {
    if (isFunctionWithBody(node)) {
      const name = getName(node)
      output[name] = getHalstead(node)
    }
    ts.forEachChild(node, cb)
  })
  return output
}

export async function calculateHalstead(filePath, target) {
  const sourceText = await readFile(filePath)
  const source = ts.createSourceFile(filePath, sourceText.toString(), target)
  return calculateFromSource(source)
}
