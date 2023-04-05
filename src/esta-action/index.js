import * as core from "@actions/core";
import { run } from "./run";

try {
  const res = await run();
} catch (error) {
  core.error(error);
  process.exit(1);
}
