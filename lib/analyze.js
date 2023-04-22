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
exports.analyze = void 0;
const core_1 = __importDefault(require("@actions/core"));
const utils_1 = require("./utils");
const harvest_1 = require("./harvest");
const promises_1 = require("fs/promises");
function analyze(sha, actor, workingDirectory, scriptTarget) {
    return __awaiter(this, void 0, void 0, function* () {
        const include = /\.ts/;
        const exclude = /\.d.ts|__mocks__|.test.ts/;
        const sourceFiles = yield (0, utils_1.getSourceFile)(workingDirectory, include, exclude);
        const analysis = yield (0, harvest_1.analyzeTypeScript)(sourceFiles, scriptTarget);
        const complexities = analysis.map(({ metrics }) => metrics.complexity);
        const total = complexities.reduce((prev, cur) => +prev + +cur, 0);
        core_1.default.info(`total complexity ${total}`);
        const folder = 'complexity-assessment';
        const filename = `${folder}/${sha}.json`;
        const analytics = {
            totalComplexity: total,
            sha,
            actor,
            analysis,
            dateUtc: new Date().toUTCString()
        };
        yield (0, promises_1.mkdir)(folder);
        yield (0, promises_1.writeFile)(filename, JSON.stringify(analytics, undefined, 2));
        core_1.default.info(`complexity assessment written: ${filename}`);
        return filename;
    });
}
exports.analyze = analyze;
