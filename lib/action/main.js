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
const core = __importStar(require("@actions/core"));
const analyze_1 = require("../lib/analyze");
const github_1 = require("@actions/github");
async function run() {
    try {
        const token = core.getInput('github_token');
        const workingDirectory = core.getInput('working_directory') || './';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const scriptTarget = core.getInput('ecma_script_target');
        const filename = await (0, analyze_1.analyze)(workingDirectory, scriptTarget, token);
        core.info(JSON.stringify(github_1.context, undefined, 2));
        // get the files and functions that were modified by the actor
        // get complexity diff
        // get min, max, mean, avg for halstead metrics
        // get min, max, mean, avg for complexity
        core.setOutput('export_filename', filename);
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
