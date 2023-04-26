import ts from 'typescript'
import {OperationMetrics} from './types'

export const isIdentifier = (kind: ts.SyntaxKind): boolean =>
  kind === ts.SyntaxKind.Identifier

export const isLiteral = (kind: ts.SyntaxKind): boolean =>
  kind >= ts.SyntaxKind.FirstLiteralToken &&
  kind <= ts.SyntaxKind.LastLiteralToken

export const isToken = (kind: ts.SyntaxKind): boolean =>
  kind >= ts.SyntaxKind.FirstPunctuation &&
  kind <= ts.SyntaxKind.LastPunctuation

export const isKeyword = (kind: ts.SyntaxKind): boolean =>
  kind >= ts.SyntaxKind.FirstKeyword && kind <= ts.SyntaxKind.LastKeyword

export const isAnOperator = (node: ts.Node): boolean =>
  isToken(node.kind) || isKeyword(node.kind)

export const isAnOperand = (node: ts.Node): boolean =>
  isIdentifier(node.kind) || isLiteral(node.kind)

export const getOperatorsAndOperands = (node: ts.Node): OperationMetrics => {
  const output: OperationMetrics = {
    operators: {total: 0, _unique: new Set([]), unique: 0},
    operands: {total: 0, _unique: new Set([]), unique: 0}
  }
  ts.forEachChild(node, function cb(currentNode) {
    if (isAnOperand(currentNode)) {
      output.operands.total++
      output.operands._unique.add(
        (currentNode as ts.Identifier).text ||
          (currentNode as ts.Identifier).escapedText.toString() ||
          (currentNode as ts.Identifier).getText() ||
          ''
      )
    } else if (isAnOperator(currentNode)) {
      output.operators.total++
      output.operators._unique.add(
        (currentNode as ts.Identifier).text || currentNode.kind
      )
    }
    ts.forEachChild(currentNode, cb)
  })
  output.operands.unique = output.operands._unique.size
  output.operators.unique = output.operators._unique.size

  return output
}

export function isFunctionWithBody(node: ts.Node): boolean {
  switch (node.kind) {
    case ts.SyntaxKind.GetAccessor:
    case ts.SyntaxKind.SetAccessor:
    case ts.SyntaxKind.FunctionDeclaration:
    case ts.SyntaxKind.MethodDeclaration:
    case ts.SyntaxKind.Constructor:
      return (node as ts.FunctionExpression).body !== undefined
    case ts.SyntaxKind.FunctionExpression:
    case ts.SyntaxKind.ArrowFunction:
      return true
    default:
      return false
  }
}
export function getName(node: ts.NamedDeclaration): string {
  const {name, pos, end} = node
  const key =
    name !== undefined && ts.isIdentifier(name)
      ? name.text
      : JSON.stringify({pos, end})
  return key
}
