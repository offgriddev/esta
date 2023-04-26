#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const calculate_estimate_1 = require("./calculate-estimate");
const gather_metrics_1 = require("./gather-metrics");
const get_estimate_propability_1 = require("./get-estimate-propability");
const calculate_complexity_1 = require("./analyze-typescript/calculate-complexity");
const calculate_halstead_1 = require("./analyze-typescript/calculate-halstead");
const calculate_merge_1 = require("./analyze-typescript/calculate-merge");
const calculate_project_complexity_1 = require("./analyze-typescript/calculate-project-complexity");
const analyze_1 = require("./analyze-typescript/analyze");
const program = new commander_1.Command()
    .name('estamaton')
    .alias('esta')
    .description('A set of CLI tools to gather metrics on a codebase')
    .addCommand(gather_metrics_1.gatherMetrics)
    .addCommand(calculate_estimate_1.calculateEstimate)
    .addCommand(get_estimate_propability_1.getEstimateProbability)
    .addCommand(calculate_complexity_1.calculateComplexityCommand)
    .addCommand(calculate_halstead_1.calculateHalsteadCommand)
    .addCommand(calculate_merge_1.calculateCodeMetricsCommand)
    .addCommand(calculate_project_complexity_1.calculateProjectComplexityCommand)
    .addCommand(analyze_1.analyzeCodeCommand);
program.parse();
