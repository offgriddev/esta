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
exports.calculateHalstead = void 0;
const typescript_1 = __importDefault(require("typescript"));
const promises_1 = require("fs/promises");
const parse_ast_1 = require("./parse-ast");
const getHalstead = (node) => {
    if ((0, parse_ast_1.isFunctionWithBody)(node)) {
        const { operands, operators } = (0, parse_ast_1.getOperatorsAndOperands)(node);
        const length = operands.total + operators.total;
        const vocabulary = operands.unique + operators.unique;
        // If legnth is 0, all other values will be NaN
        if (length === 0 || vocabulary === 1)
            return {};
        const volume = length * Math.log2(vocabulary);
        const difficulty = (operators.unique / 2) * (operands.total / operands.unique);
        const effort = volume * difficulty;
        const time = effort / 18;
        const bugsDelivered = Math.pow(effort, (2 / 3)) / 3000;
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
        };
    }
    return {};
};
// Returns the halstead volume for a function
// If passed node is not a function, returns empty object
const calculateFromSource = (source) => {
    const output = {};
    typescript_1.default.forEachChild(source, function cb(node) {
        if ((0, parse_ast_1.isFunctionWithBody)(node)) {
            const name = (0, parse_ast_1.getName)(node);
            output[name] = getHalstead(node);
        }
        typescript_1.default.forEachChild(node, cb);
    });
    return output;
};
function calculateHalstead(filePath, target) {
    return __awaiter(this, void 0, void 0, function* () {
        const sourceText = yield (0, promises_1.readFile)(filePath);
        const source = typescript_1.default.createSourceFile(filePath, sourceText.toString(), target);
        return calculateFromSource(source);
    });
}
exports.calculateHalstead = calculateHalstead;
