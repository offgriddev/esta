"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommitMetrics = void 0;
const promises_1 = __importDefault(require("fs/promises"));
async function getCommitMetrics() {
    const directory = './data/commit-metrics';
    const files = await promises_1.default.readdir(directory);
    const content = [];
    for (const file of files) {
        const fileContent = await promises_1.default.readFile(`${directory}/${file}`, 'utf-8');
        content.push(JSON.parse(fileContent));
    }
    return content.sort((a, b) => a.dateUtc === b.dateUtc ? 0 : a.dateUtc < b.dateUtc ? 1 : -1);
}
exports.getCommitMetrics = getCommitMetrics;
