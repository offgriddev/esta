"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printCommits = void 0;
const commander_1 = require("commander");
const fs_1 = require("../../lib/fs");
exports.printCommits = new commander_1.Command()
    .name('print-commits')
    .alias('pc')
    .action(async () => {
    const items = await (0, fs_1.getCommitMetrics)();
    const slim = [];
    for (const { sha, actor, head, ref, totalComplexity, dateUtc } of items) {
        slim.push({
            sha,
            actor,
            head,
            ref,
            totalComplexity,
            dateUtc
        });
    }
    console.table(slim);
});
