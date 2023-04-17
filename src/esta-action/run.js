import { getSourceFile } from "./utils.js";
import core from "@actions/core";
import { analyzeJavaScript, analyzeTypeScript } from "./harvest.js";

/**
 * run performs the operations required for objective assessment
 * 1. perform calculations against a given directory defaults to '.'
 * 2. export github statistics to blob storage
 */
export async function run() {
  const config = {
    sha: core.getInput("sha"),
    actor: core.getInput("actor"),
    working_directory: core.getInput("working_directory") || ".",
    language: core.getInput("language"),
  };
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
  }[config.language];
  const sourceFiles = await getSourceFile(directory, include, exclude);
  let metrics = analyze(sourceFiles);

  const complexities = metrics.map(({ complexity }) => complexity);
  const total = complexities.reduce((prev, cur) => +prev + +cur, 0);
  console.log(total);
}
