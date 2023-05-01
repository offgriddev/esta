"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printCommits = void 0;
const commander_1 = require("commander");
const promises_1 = __importDefault(require("fs/promises"));
const logger_1 = require("../lib/logger");
exports.printCommits = new commander_1.Command()
    .name('print-commits')
    .alias('pc')
    .action(async () => {
    const directory = './data/commit-metrics';
    const files = await promises_1.default.readdir(directory);
    const content = [];
    for (const file of files) {
        const fileContent = await promises_1.default.readFile(`${directory}/${file}`, 'utf-8');
        content.push(JSON.parse(fileContent));
    }
    const items = content.sort((a, b) => a.dateUtc === b.dateUtc ? 0 : a.dateUtc > b.dateUtc ? 1 : -1);
    for (const { sha, actor, head, ref, totalComplexity, dateUtc } of items) {
        logger_1.logger.info({
            sha,
            actor,
            head,
            ref,
            totalComplexity,
            dateUtc
        });
    }
});
