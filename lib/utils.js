"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceFile = void 0;
const promises_1 = require("fs/promises");
function getSourceFile(folder, includedType, excludedType) {
    return __awaiter(this, void 0, void 0, function* () {
        let filePaths = [];
        // get contents for folder
        const paths = yield (0, promises_1.readdir)(folder, { withFileTypes: true });
        // check if item is a directory
        for (const path of paths) {
            const filePath = `${folder}/${path.name}`;
            if (path.isDirectory()) {
                if (path.name.match(/.*node_modules.*|.git|.github/))
                    continue;
                const recursePaths = yield getSourceFile(`${folder}/${path.name}`, includedType, excludedType);
                filePaths = filePaths.concat(recursePaths);
            }
            else {
                if (filePath.match(includedType) && !filePath.match(excludedType))
                    filePaths.push(filePath);
            }
        }
        return filePaths;
    });
}
exports.getSourceFile = getSourceFile;
