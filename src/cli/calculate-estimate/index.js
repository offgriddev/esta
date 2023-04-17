import { Command } from "commander";
import { estimate } from "../../lib/index.js";
import { readFile } from "fs/promises";
import { parse } from "csv/sync";
const columns = [
  "Summary",
  "Key",
  "StatusDate",
  "Labels",
  "EpicName",
  "EpicColor",
  "EpicLink",
  "Complexity",
];
export const calculateEstimate = new Command()
  .name("calculate-estimate")
  .alias("ce")
  .argument("<data>", "location for export")
  .argument(
    "<avg-speed>",
    "Average hours (24hour cycle) to deliver 1 unit of complexity"
  )
  .argument(
    "<possible-hours>",
    "Total possible hours in a given week (5 days = 120)"
  )
  .argument("<number-of-devs>", "Number of devs assigned to the project")
  .description("Calculates estimates based on a Jira export")
  .action(async (data, avgSpeed, possibleHours, devCount, sampleSize) => {
    const contents = await readFile(data, "utf-8");
    const records = parse(contents, { from_line: 2, columns });
    const { totalComplexity, weeks } = await estimate(
      records,
      avgSpeed,
      possibleHours,
      devCount
    );
    console.log(JSON.stringify(weeks, "", 2));
    console.log(`Total complexity to deliver: ${totalComplexity}`);
    console.log(`Number of Devs: ${devCount}`);
    console.log(
      `Average delivery speed for 1 unit of complexity (in hours): ${avgSpeed}`
    );
    console.log(
      `Total hours possible per developer on project per week: ${possibleHours}, ${Math.round(
        (possibleHours / 120) * 100
      )}% of a normal working week`
    );
    console.log(`Total amount of weeks: ${weeks.length}`);
  });
