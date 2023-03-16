import { Command } from "commander";
import { readFile } from "fs/promises";
import { parse } from "csv/sync";
import groupBy from "lodash.groupby";
import random from "lodash.random";

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
  .action(async (data, avgSpeed, possibleHours, numberOfDevs) => {
    const contents = await readFile(data, "utf-8");
    const records = parse(contents, { from_line: 2, columns });
    const groupedRecords = groupBy(records, "EpicLink");
    const keys = Object.keys(groupedRecords);
    const hoursPerWeek = +possibleHours;
    let totalComplexity = 0;

    for (const key of keys) {
      const complexities = groupedRecords[key].map(({ Complexity, Key }) => ({
        complexity: +Complexity,
        key: Key,
      }));
      groupedRecords[key] = {
        total: complexities.reduce(
          (prev, { complexity }) => prev + complexity,
          0
        ),
        facts: complexities.filter(({ complexity }) => complexity > 0),
      };
      totalComplexity += groupedRecords[key].total;
    }
    const devCount = numberOfDevs;
    // pick a card
    // calculate the days required to finish
    // calculate how many days are left for week
    // pick another card until time in week is close to zero
    const players = [];
    for (let i = 0; i < devCount; i++) {
      players.push({
        name: `Dev ${i}`,
        averageDelivery: avgSpeed,
        weeks: [],
      });
    }

    /**
     * Returns a player with time remaining for the week
     * if returns undefined, then it's time to work through next week
     * @param {[]Object} players
     * @param {number} currentWeek
     */
    const getPlayer = (players, currentWeek, currentCard) => {
      const playersCopy = [...players];
      while (playersCopy.length > 0) {
        const index = Math.floor(Math.random() * playersCopy.length);
        const player = playersCopy[index];
        const playerWeek = player.weeks[currentWeek] || [];
        // get hours worked for week based on card complexity
        // if player weekly total + complexity hours > 120, remove from list
        // if player weekly total + complexity hours < 120, then return player
        // if no players available, return undefined
        const hours = currentCard.complexity * avgSpeed;
        const playerWeeklyTotal = playerWeek.reduce(
          (prev, { hours }) => hours + prev,
          0
        );

        // get the amount over for the week
        // calculate in working hours (24/8). If less than 50% of the day
        // is remaining on an overage, don't take a new card.
        // If the current card has more than 60 % of the task over
        // the weekly limit, then carry over a reasonable amount of the work
        // to the following week
        const isGreaterThanAvailable =
          +playerWeeklyTotal + hours > hoursPerWeek;
        const overage = isGreaterThanAvailable
          ? Math.abs(hoursPerWeek - (+playerWeeklyTotal + hours))
          : 0;
        const workable = hours - overage;
        const worthPickingUp = workable / 24 > 0.4; // it's worth picking up if the amount of hours left is greater than 50% of an average day

        if (worthPickingUp) {
          return [player, { workable, overage }];
        } else {
          playersCopy.splice(index, 1);
        }
      }
      return [undefined, {}];
    };

    for (const key of keys) {
      let currentWeek = 0;
      const cards = groupedRecords[key].facts;
      while (cards.length > 0) {
        const cardIndex = Math.floor(Math.random() * cards.length);
        const card = cards[cardIndex];

        // player selection
        const [player, { workable, overage }] = getPlayer(
          players,
          currentWeek,
          card
        );
        if (!player) {
          // If no player is free to pick up a card
          // the week is over
          currentWeek++;
        } else {
          player.weeks[currentWeek] = player.weeks[currentWeek] || [];
          player.weeks[currentWeek].push({
            ...card,
            player: player.name,
            epic: key,
            hours: workable,
          });

          if (overage > 0) {
            // overages get pushed into next week
            player.weeks[currentWeek + 1] = player.weeks[currentWeek + 1] || [];
            player.weeks[currentWeek + 1].push({
              ...card,
              player: player.name,
              epic: key,
              hours: overage,
            });
          }
          cards.splice(cardIndex, 1);
        }
      }
    }
    const weeks = [];
    const playersCopy = [...players];
    while (playersCopy.length > 0) {
      const player = playersCopy[0];
      // add each players totals for a week
      for (let w = 0; w < player.weeks.length; w++) {
        const givenWeek = weeks[w] || [];
        const playerWeek = player.weeks[w];
        const combinedWeek = givenWeek.concat(playerWeek);
        weeks[w] = combinedWeek;
      }
      playersCopy.splice(0, 1);
    }
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
    //console.log(JSON.stringify(players, "", 2));
  });
