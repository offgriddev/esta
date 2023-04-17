import { getSourceFile } from "./utils";
import core from "@actions/core";
import { analyzeJavaScript, analyzeTypeScript } from "./harvest";

/**
 * run performs the operations required for objective assessment
 * 1. perform calculations against a given directory defaults to '.'
 * 2. export github statistics to blob storage
 */
export async function run() {
  const directory = core.getInput("working_directory");
  const language = core.getInput("language");
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
  const sourceFiles = await getSourceFile(directory, include, exclude);
  let metrics = analyze(sourceFiles);

  const complexities = metrics.map(({ complexity }) => complexity);
  const total = complexities.reduce((prev, cur) => +prev + +cur, 0);
  console.log(total);
}
