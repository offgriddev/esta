import * as core from "@actions/core";
import { run } from "./run.js";

try {
  await run();
} catch (error) {
  console.log(error);
  core.error(error);
  process.exit(1);
}
