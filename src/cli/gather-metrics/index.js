import { Command } from "commander";
import { getSourceFile } from "../../lib/index.js";
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

export const gatherMetrics = new Command()
  .name("gather-metrics")
  .alias("gm")
  .argument("<language>", "JS and TS supported")
  .argument("<dir>", "directory to scan")
  .description("Allows you to gather metrics on a given codebase")
  .action(async (language, dir) => {
    // get all the paths for files to evaluate

    const { include, exclude, analyze } = {
      ts: {
        include: /\.ts/,
        exclude: /\.d.ts|__mocks__|.test.ts/,
        analyze: analyzeTypeScript,
      },
      js: {
        include: /\.js/,
        exclude: /\.test.js/,
        analyze: analyzeJavaScript,
      },
    }[language];
    const sourceFiles = await getSourceFile(dir, include, exclude);

    // get all source files
    // run analysis on source files
    let metrics = analyze(sourceFiles);

    const complexities = metrics.map(({ complexity }) => complexity);
    const total = complexities.reduce((prev, cur) => +prev + +cur, 0);
    console.log(total);
  });
