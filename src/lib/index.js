import { readdir } from "fs/promises";

export const getSourceFile = async (folder, includedType, excludedType) => {
  let filePaths = [];
  // get contents for folder
  const paths = await readdir(folder, { withFileTypes: true });
  // check if item is a directory

  for (let p = 0; p < paths.length; p++) {
    const path = paths[p];
    const filePath = `${folder}/${path.name}`;

    if (path.isDirectory()) {
      if (path.name.match(/.*node_modules.*|.*dist.*/)) continue;

      const recursePaths = await getSourceFile(
        `${folder}/${path.name}`,
        includedType,
        excludedType
      );
      filePaths = filePaths.concat(recursePaths);
    } else {
      if (filePath.match(includedType) && !filePath.match(excludedType))
        filePaths.push(filePath);
    }
  }
  return filePaths;
};
