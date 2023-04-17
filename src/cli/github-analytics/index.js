import { Command } from "commander";

export const printGithubContext = new Command()
  .name("print-github-context")
  .alias("pgc")
  .argument("<data>", "location for export")
  .description("Calculates estimates based on a Jira export")
  .action(async (data) => {
    console.log(JSON.stringify(data, "", 2));
  });
