"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyze = void 0;
const gh = __importStar(require("@actions/github"));
const core = __importStar(require("@actions/core"));
const promises_1 = require("fs/promises");
const utils_1 = require("./utils");
const harvest_1 = require("./harvest");
const logger_1 = require("../cmds/lib/logger");
function getBranch(github) {
    const client = gh.getOctokit(github.token);
    const key = github.ref.split('/')[1];
    const keyVal = github.ref.split('/')[2];
    const keyFunc = {
        // pull requests
        'pulls': async () => {
            const pull = await client.rest.pulls.get({
                owner: github.repository_owner,
                repo: github.repository,
                pull_number: +keyVal,
                mediaType: {
                    format: 'diff'
                }
            });
            core.info(JSON.stringify(pull, undefined, 2));
        }
    }[key];
    if (!keyFunc) {
        core.setFailed(`Could not find function to handle ${github.ref}`);
    }
    return '';
}
async function analyze(workingDirectory, scriptTarget, github) {
    const include = /\.ts$/;
    const exclude = /\.d.ts|__mocks__|.test.ts/;
    const sourceFiles = await (0, utils_1.getSourceFile)(workingDirectory, include, exclude);
    const analysis = await (0, harvest_1.analyzeTypeScript)(sourceFiles, scriptTarget);
    const complexities = analysis.map(({ metrics }) => {
        const functions = Object.keys(metrics);
        const functionComplexity = functions.map(func => metrics[func].complexity);
        const max = Object.values(functionComplexity).reduce((prev, cur) => {
            return prev > cur ? prev : cur;
        }, 0);
        return max;
    });
    const total = complexities.reduce((prev, cur) => +prev + +cur, 0);
    logger_1.logger.info(`total complexity ${total}`);
    const folder = 'complexity-assessment';
    const filename = `${folder}/${github.sha}.json`;
    const branch = getBranch(github);
    const analytics = {
        totalComplexity: total,
        sha: github.sha,
        actor: github.actor,
        ref: github.ref,
        headRef: github.head_ref,
        actorId: github.actor_id,
        repository: github.repository,
        repositoryId: github.repository_id,
        branch,
        event: github.event,
        analysis,
        dateUtc: new Date().toISOString()
    };
    await (0, promises_1.mkdir)(folder);
    await (0, promises_1.writeFile)(filename, JSON.stringify(analytics, undefined, 2));
    logger_1.logger.info(`complexity assessment written: ${filename}`);
    return filename;
}
exports.analyze = analyze;
