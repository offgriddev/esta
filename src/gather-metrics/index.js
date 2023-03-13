import { Command } from "commander";
import { getSourceFile } from "../lib";

// @ts-ignore next-line
import tscomplex from "ts-complex";

export function analyzeSourceFiles(sourceFiles) {
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

export const gatherMetrics = new Command()
  .name("gather-metrics")
  .alias("gm")
  .description("Allows you to gather metrics on a given codebase")
  .action(async () => {
    // language is either 'js' or 'ts'
    // get all the paths for files to evaluate
    const sourceFiles = await getSourceFile(process.cwd(), /\.ts/, /\.d.ts/);

    // get all source files
    // run analysis on source files
    const metrics = analyzeSourceFiles(sourceFiles);

    const complexities = metrics.map(({ complexity }) => complexity);
    const total = complexities.reduce((prev, cur) => +prev + +cur, 0);
    console.log(total);
    // produce local file
    // write file
    // await fs.writeFile(
    //   `${process.cwd()}/computational-estimate-data.json`,
    //   JSON.stringify(metrics)
    // );
  });
