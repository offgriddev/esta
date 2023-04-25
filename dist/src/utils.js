"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceFile = void 0;
const promises_1 = require("fs/promises");
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
