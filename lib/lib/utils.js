"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceFile = exports.analyzeTypeScriptProject = void 0;
const promises_1 = require("fs/promises");
const complexity_1 = require("./complexity");
// current support only ts
async function analyzeTypeScriptProject(sourceFiles, scriptTarget) {
    const metrics = [];
    for (const file of sourceFiles) {
        const result = await (0, complexity_1.calculateComplexity)(file, scriptTarget);
        const max = Object.values(result).reduce((prev, cur) => {
            return prev > cur.complexity ? prev : cur.complexity;
        }, 0);
        if ((max).toString() === '[object Object]') {
            process.exit(1);
        }
        metrics.push({
            source: file,
            complexity: max
        });
    }
    return metrics;
}
exports.analyzeTypeScriptProject = analyzeTypeScriptProject;
async function getSourceFile(folder, includedType, excludedType) {
    let filePaths = [];
    // get contents for folder
    const paths = await (0, promises_1.readdir)(folder, { withFileTypes: true });
    // check if item is a directory
    for (const path of paths) {
        const filePath = `${folder}/${path.name}`;
        if (path.isDirectory()) {
            if (path.name.match(/.*node_modules.*|.git|.github/))
                continue;
            const recursePaths = await getSourceFile(`${folder}/${path.name}`, includedType, excludedType);
            filePaths = filePaths.concat(recursePaths);
        }
        else {
            if (filePath.match(includedType) && !filePath.match(excludedType))
                filePaths.push(filePath);
        }
    }
    return filePaths;
}
exports.getSourceFile = getSourceFile;