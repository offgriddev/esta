import * as core from "@actions/core";
import { run } from "./run.js";

try {
  await run();
} catch (error) {
  core.error(error);
  process.exit(1);
}
