import ts from 'typescript'

export const isIdentifier = kind => kind === ts.SyntaxKind.Identifier
export const isLiteral = kind =>
  kind >= ts.SyntaxKind.FirstLiteralToken &&
  kind <= ts.SyntaxKind.LastLiteralToken

export const isToken = kind =>
  kind >= ts.SyntaxKind.FirstPunctuation &&
  kind <= ts.SyntaxKind.LastPunctuation

export const isKeyword = kind =>
  kind >= ts.SyntaxKind.FirstKeyword && kind <= ts.SyntaxKind.LastKeyword

export const isAnOperator = node => isToken(node.kind) || isKeyword(node.kind)
export const isAnOperand = node =>
  isIdentifier(node.kind) || isLiteral(node.kind)

export const getOperatorsAndOperands = node => {
  const output = {
    operators: {total: 0, _unique: new Set([]), unique: 0},
    operands: {total: 0, _unique: new Set([]), unique: 0}
  }
  ts.forEachChild(node, function cb(currentNode) {
    if (isAnOperand(currentNode)) {
      output.operands.total++
      output.operands._unique.add(
        currentNode.text || currentNode.escapedText.toString()
      )
    } else if (isAnOperator(currentNode)) {
      output.operators.total++
      output.operators._unique.add(currentNode.text || currentNode.kind)
    }
    ts.forEachChild(currentNode, cb)
  })
  output.operands.unique = output.operands._unique.size
  output.operators.unique = output.operators._unique.size

  return output
}
// https://github.com/ajafff/tsutils/blob/03b4df15d14702f9c7a128ac3fae77171778d613/util/util.ts#L446
export function isFunctionWithBody(node) {
  switch (node.kind) {
    case ts.SyntaxKind.GetAccessor:
    case ts.SyntaxKind.SetAccessor:
    case ts.SyntaxKind.FunctionDeclaration:
    case ts.SyntaxKind.MethodDeclaration:
    case ts.SyntaxKind.Constructor:
      return node.body !== undefined
    case ts.SyntaxKind.FunctionExpression:
    case ts.SyntaxKind.ArrowFunction:
      return true
    default:
      return false
  }
}
export function getName(node) {
  const {name, pos, end} = node
  const key =
    name !== undefined && ts.isIdentifier(name)
      ? name.text
      : JSON.stringify({pos, end})
  return key
}
