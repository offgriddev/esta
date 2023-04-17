import { Command } from "commander";
import { getSourceFile } from "../lib/index.js";
import tscomplex from "ts-complex";
import escomplex from "escomplex";

// current support only ts
export function analyzeTypeScript(sourceFiles) {
  const metrics = [];
  for (let s = 0; s < sourceFiles.length; s++) {
    const file = sourceFiles[s];
    const halstead = tscomplex.calculateCyclomaticComplexity(file);
    const complexity = halstead[Object.keys(halstead)[0]];
    if (!complexity) {
      console.log(`${file}: 0`);
      continue;
    }
    console.log(`${file}: ${complexity}`);
    metrics.push({
      source: file,
      complexity,
    });
  }

  return metrics;
}

export function analyzeJavaScript(sourceFiles) {
  const metrics = [];
  for (let s = 0; s < sourceFiles.length; s++) {
    const file = sourceFiles[s];
    const result = escomplex.analyse(file);
    console.log(file);
    console.log(result);
    // const complexity = halstead[Object.keys(halstead)[0]];
    // if (!complexity) {
    //   console.log(`${file}: 0`);
    //   continue;
    // }
    // console.log(`${file}: ${complexity}`);
    //    metrics.push({
    //      source: file,
    //      complexity,
    //    });
  }

  return metrics;
}
