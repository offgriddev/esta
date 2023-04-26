#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const index_js_1 = require("./calculate-estimate/index.js");
const index_js_2 = require("./gather-metrics/index.js");
const index_js_3 = require("./get-estimate-propability/index.js");
const index_js_4 = require("./analyze-typescript/index.js");
const calculate_merge_js_1 = require("./analyze-typescript/calculate-merge.js");
const program = new commander_1.Command()
    .name('estamaton')
    .alias('esta')
    .description('A set of CLI tools to gather metrics on a codebase')
    .addCommand(index_js_2.gatherMetrics)
    .addCommand(index_js_1.calculateEstimate)
    .addCommand(index_js_3.getEstimateProbability)
    .addCommand(index_js_4.calculateComplexityCommand)
    .addCommand(index_js_4.calculateMaintainabilityCommand)
    .addCommand(index_js_4.calculateHalsteadCommand)
    .addCommand(calculate_merge_js_1.calculateCodeMetricsCommand);
await program.parseAsync();
