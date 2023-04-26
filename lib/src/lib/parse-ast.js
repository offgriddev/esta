"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getName = exports.isFunctionWithBody = exports.getOperatorsAndOperands = exports.isAnOperand = exports.isAnOperator = exports.isKeyword = exports.isToken = exports.isLiteral = exports.isIdentifier = void 0;
const typescript_1 = __importDefault(require("typescript"));
const isIdentifier = (kind) => kind === typescript_1.default.SyntaxKind.Identifier;
exports.isIdentifier = isIdentifier;
const isLiteral = (kind) => kind >= typescript_1.default.SyntaxKind.FirstLiteralToken &&
    kind <= typescript_1.default.SyntaxKind.LastLiteralToken;
exports.isLiteral = isLiteral;
const isToken = (kind) => kind >= typescript_1.default.SyntaxKind.FirstPunctuation &&
    kind <= typescript_1.default.SyntaxKind.LastPunctuation;
exports.isToken = isToken;
const isKeyword = (kind) => kind >= typescript_1.default.SyntaxKind.FirstKeyword && kind <= typescript_1.default.SyntaxKind.LastKeyword;
exports.isKeyword = isKeyword;
const isAnOperator = (node) => (0, exports.isToken)(node.kind) || (0, exports.isKeyword)(node.kind);
exports.isAnOperator = isAnOperator;
const isAnOperand = (node) => (0, exports.isIdentifier)(node.kind) || (0, exports.isLiteral)(node.kind);
exports.isAnOperand = isAnOperand;
const getOperatorsAndOperands = (node) => {
    const output = {
        operators: { total: 0, _unique: new Set([]), unique: 0 },
        operands: { total: 0, _unique: new Set([]), unique: 0 }
    };
    typescript_1.default.forEachChild(node, function cb(currentNode) {
        if ((0, exports.isAnOperand)(currentNode)) {
            output.operands.total++;
            output.operands._unique.add(currentNode.text ||
                currentNode.escapedText.toString() ||
                currentNode.getText() ||
                '');
        }
        else if ((0, exports.isAnOperator)(currentNode)) {
            output.operators.total++;
            output.operators._unique.add(currentNode.text || currentNode.kind);
        }
        typescript_1.default.forEachChild(currentNode, cb);
    });
    output.operands.unique = output.operands._unique.size;
    output.operators.unique = output.operators._unique.size;
    return output;
};
exports.getOperatorsAndOperands = getOperatorsAndOperands;
function isFunctionWithBody(node) {
    switch (node.kind) {
        case typescript_1.default.SyntaxKind.GetAccessor:
        case typescript_1.default.SyntaxKind.SetAccessor:
        case typescript_1.default.SyntaxKind.FunctionDeclaration:
        case typescript_1.default.SyntaxKind.MethodDeclaration:
        case typescript_1.default.SyntaxKind.Constructor:
            return node.body !== undefined;
        case typescript_1.default.SyntaxKind.FunctionExpression:
        case typescript_1.default.SyntaxKind.ArrowFunction:
            return true;
        default:
            return false;
    }
}
exports.isFunctionWithBody = isFunctionWithBody;
function getName(node) {
    const { name, pos, end } = node;
    const key = name !== undefined && typescript_1.default.isIdentifier(name)
        ? name.text
        : JSON.stringify({ pos, end });
    return key;
}
exports.getName = getName;
