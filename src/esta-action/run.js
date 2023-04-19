import { getSourceFile } from "./utils.js";
import core from "@actions/core";
import { analyzeJavaScript, analyzeTypeScript } from "./harvest.js";
import { writeFile, mkdir } from "fs/promises";

/**
 * run performs the operations required for objective assessment
 * 1. perform calculations against a given directory defaults to '.'
 * 2. export github statistics to blob storage
 */
export async function run() {
  const sha = core.getInput("sha");
  const actor = core.getInput("actor");
  const working_directory = core.getInput("working_directory");
  const language = core.getInput("language");

  const { include, exclude, analyze } = {
    ts: {
      include: /\.ts/,
      exclude: /\.d.ts|__mocks__|.test.ts/,
      analyze: analyzeTypeScript,
    },
    js: {
      include: /\.js/,
      exclude: /\.test.js|__mocks__/,
      analyze: analyzeJavaScript,
    },
  }[language];
  const sourceFiles = await getSourceFile(working_directory, include, exclude);
  let metrics = analyze(sourceFiles);

  const complexities = metrics.map(({ complexity }) => complexity);
  const total = complexities.reduce((prev, cur) => +prev + +cur, 0);
  console.log("total complexity", total);
  const folder = "complexity-assessment";
  const filename = `${folder}/${sha}.json`;
  const analytics = {
    totalComplexity: total,
    sha,
    actor,
    metrics,
  };
  await mkdir(folder);
  await writeFile(filename, JSON.stringify(analytics, "", 2));

  console.log(JSON.stringify(analytics, "", 2));
  console.log(`complexity assessment written: ${filename}`);
  // write to folder to then use in subsequent actions
  core.setOutput("export_filename", filename);

  // we just need to write a file to be uploade with the relevant
  // github actor, branch, commit sha,
}
