"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetricCommand = void 0;
const commander_1 = require("commander");
const promises_1 = __importDefault(require("fs/promises"));
const logger_1 = require("../lib/logger");
exports.getMetricCommand = new commander_1.Command()
    .name('get-metric')
    .alias('gmet')
    .option('-S, --sha <sha>', 'gitsha to print')
    .action(async (options) => {
    const content = await promises_1.default.readFile(`./data/commit-metrics/${options.sha}.json`, 'utf-8');
    logger_1.logger.info(JSON.parse(content));
});
