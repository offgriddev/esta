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
const analyze_1 = require("../analyze");
const harvest_1 = require("../harvest");
const typescript_1 = __importDefault(require("typescript"));
jest.mock('../utils', () => ({
    getSourceFile: jest.fn().mockResolvedValue(['file1', 'file2'])
}));
jest.mock('../harvest', () => ({
    analyzeTypeScript: jest.fn(() => [
        {
            source: 'file1',
            metrics: {
                length: 74,
                vocabulary: 43,
                volume: 401.54359184795527,
                difficulty: 4.276315789473684,
                effort: 1717.1272019813875,
                time: 95.39595566563264,
                bugsDelivered: 0.04779844014451811,
                operands: {
                    total: 65,
                    _unique: {},
                    unique: 38
                },
                operators: {
                    total: 9,
                    _unique: {},
                    unique: 5
                },
                complexity: 1
            }
        },
        {
            source: 'file2',
            metrics: {
                length: 3,
                vocabulary: 2,
                volume: 3,
                difficulty: 1,
                effort: 3,
                time: 0.16666666666666666,
                bugsDelivered: 0.0006933612743506347,
                operands: {
                    total: 2,
                    _unique: {},
                    unique: 1
                },
                operators: {
                    total: 1,
                    _unique: {},
                    unique: 1
                },
                complexity: 1
            }
        }
    ])
}));
jest.mock('fs/promises', () => ({
    mkdir: jest.fn().mockResolvedValue(undefined),
    writeFile: jest.fn().mockResolvedValue(undefined)
}));
jest.mock('@actions/core', () => ({
    debug: jest.fn().mockReturnValue(undefined),
    info: jest.fn().mockReturnValue(undefined)
}));
describe(__filename, () => {
    it('calls getSourceFile', () => __awaiter(void 0, void 0, void 0, function* () {
        const filename = yield (0, analyze_1.analyze)('sha', 'actor', 'workingDirectory', typescript_1.default.ScriptTarget.ES2018);
        expect(filename).toEqual('complexity-assessment/sha.json');
    }));
    it('calls analyzeTypeScript', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, analyze_1.analyze)('sha', 'actor', 'workingDirectory', typescript_1.default.ScriptTarget.ES2018);
        expect(harvest_1.analyzeTypeScript).toBeCalledWith(['file1', 'file2'], typescript_1.default.ScriptTarget.ES2018);
    }));
    it('makes a directory', () => { });
    it('writes a file', () => { });
    it('returns the filename', () => __awaiter(void 0, void 0, void 0, function* () {
        const filename = yield (0, analyze_1.analyze)('sha', 'actor', 'workingDirectory', typescript_1.default.ScriptTarget.ES2018);
        expect(filename).toEqual('complexity-assessment/sha.json');
    }));
});
