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
exports.analyzeTypeScript = void 0;
const core_1 = __importDefault(require("@actions/core"));
const typescript_1 = __importDefault(require("typescript"));
const halstead_1 = require("./halstead");
const complexity_1 = require("./complexity");
const lodash_mergewith_1 = __importDefault(require("lodash.mergewith"));
// current support only ts
function analyzeTypeScript(sourceFiles, scriptTarget) {
    return __awaiter(this, void 0, void 0, function* () {
        const metrics = [];
        for (const filename of sourceFiles) {
            const halsteadMetrics = yield (0, halstead_1.calculateHalstead)(filename, scriptTarget || typescript_1.default.ScriptTarget.ES2018);
            const complexityMeasure = yield (0, complexity_1.calculateComplexity)(filename, scriptTarget || typescript_1.default.ScriptTarget.ES2018);
            const result = (0, lodash_mergewith_1.default)(halsteadMetrics, complexityMeasure);
            core_1.default.info(`${filename}: ${JSON.stringify(result, undefined, 2)}`);
            metrics.push({
                source: filename,
                metrics: result
            });
        }
        return metrics;
    });
}
exports.analyzeTypeScript = analyzeTypeScript;
