"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateComplexity = exports.calculateFromSource = void 0;
const promises_1 = require("fs/promises");
const typescript_1 = __importDefault(require("typescript"));
const parse_ast_1 = require("./parse-ast");
const increasesComplexity = (node) => {
    switch (node.kind) {
        case typescript_1.default.SyntaxKind.CaseClause:
            return node.statements.length > 0;
        case typescript_1.default.SyntaxKind.CatchClause:
        case typescript_1.default.SyntaxKind.ConditionalExpression:
        case typescript_1.default.SyntaxKind.DoStatement:
        case typescript_1.default.SyntaxKind.ForStatement:
        case typescript_1.default.SyntaxKind.ForInStatement:
        case typescript_1.default.SyntaxKind.ForOfStatement:
        case typescript_1.default.SyntaxKind.IfStatement:
        case typescript_1.default.SyntaxKind.WhileStatement:
            return true;
        case typescript_1.default.SyntaxKind.BinaryExpression:
            switch (node.operatorToken.kind) {
                case typescript_1.default.SyntaxKind.BarBarToken:
                case typescript_1.default.SyntaxKind.AmpersandAmpersandToken:
                    return true;
                default:
                    return false;
            }
        default:
            return false;
    }
};
function calculateFromSource(source) {
    let complexity = 0;
    const output = {};
    typescript_1.default.forEachChild(source, function cb(node) {
        if ((0, parse_ast_1.isFunctionWithBody)(node)) {
            const old = complexity;
            complexity = 1;
            typescript_1.default.forEachChild(node, cb);
            const name = (0, parse_ast_1.getName)(node);
            output[name] = complexity;
            complexity = old;
        }
        else {
            if (increasesComplexity(node)) {
                complexity += 1;
            }
            typescript_1.default.forEachChild(node, cb);
        }
    });
    return output;
}
exports.calculateFromSource = calculateFromSource;
function calculateComplexity(filePath, scriptTarget) {
    return __awaiter(this, void 0, void 0, function* () {
        const sourceText = yield (0, promises_1.readFile)(filePath);
        const source = typescript_1.default.createSourceFile(filePath, sourceText.toString(), scriptTarget);
        return calculateFromSource(source);
    });
}
exports.calculateComplexity = calculateComplexity;
