#!/usr/bin/env node

import { Command } from "commander";
import { gatherMetrics } from "./gather-metrics/index";

const program = new Command()
  .name("estamaton")
  .alias("esta")
  .description("A set of CLI tools to gather metrics on a codebase")
  .addCommand(gatherMetrics);

program.parseAsync();
