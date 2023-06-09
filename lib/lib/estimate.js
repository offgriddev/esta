"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimate = void 0;
const lodash_groupby_1 = __importDefault(require("lodash.groupby"));
const addOverages = (player, currentWeek, key, overage, card, hoursPerWeek) => {
    if (overage > 0) {
        // overages get pushed into next week
        const leftoverAmount = overage - hoursPerWeek;
        player.weeks[+currentWeek + 1] = player.weeks[+currentWeek + 1] || [];
        player.weeks[+currentWeek + 1].push({
            ...card,
            player: player.name,
            epic: key,
            hours: leftoverAmount < 0 ? hoursPerWeek + leftoverAmount : hoursPerWeek,
        });
        if (leftoverAmount > 0) {
            addOverages(player, currentWeek + 1, key, leftoverAmount, card, hoursPerWeek);
        }
    }
};
/**
 * Returns a player with time remaining for the week
 * if returns undefined, then it's time to work through next week
 * @param {[]Object} players
 * @param {number} currentWeek
 */
const getPlayer = (players, currentWeek, currentCard, avgSpeed, hoursPerWeek) => {
    const playersCopy = [...players];
    while (playersCopy.length > 0) {
        const index = Math.floor(Math.random() * playersCopy.length);
        const player = playersCopy[index];
        const playerWeek = player.weeks[currentWeek] || [];
        // get hours worked for week based on card complexity
        // if player weekly total + complexity hours > 120, remove from list
        // if player weekly total + complexity hours < 120, then return player
        // if no players available, return undefined
        // not sure if this will throw it off
        const playerWeeklyTotal = playerWeek.reduce((prev, { hours }) => +hours + +prev, 0);
        // get the amount over for the week
        // calculate in working hours (24/8). If less than 50% of the day
        // is remaining on an overage, don't take a new card.
        // If the current card has more than 60 % of the task over
        // the weekly limit, then carry over a reasonable amount of the work
        // to the following week
        const hours = currentCard.complexity * avgSpeed;
        const isGreaterThanAvailable = +playerWeeklyTotal + +hours > hoursPerWeek;
        const overage = isGreaterThanAvailable
            ? Math.abs(hoursPerWeek - (+playerWeeklyTotal + hours))
            : 0;
        const workable = hours - overage;
        const worthPickingUp = workable / 24 > 0.4; // it's worth picking up if the amount of hours left is greater than 50% of an average day
        if (worthPickingUp) {
            return [player, { workable, overage }];
        }
        else {
            playersCopy.splice(index, 1);
        }
    }
    return [undefined, {}];
};
async function estimate(records, avgSpeed, possibleHours, numberOfDevs) {
    const groupedRecords = (0, lodash_groupby_1.default)(records, "EpicLink");
    const keys = Object.keys(groupedRecords);
    const hoursPerWeek = +possibleHours;
    let totalComplexity = 0;
    const estimateTotals = {};
    for (const key of keys) {
        const complexities = groupedRecords[key].map(({ Complexity, Key }) => ({
            complexity: +Complexity,
            key: Key,
        }));
        estimateTotals[key] = {
            total: complexities.reduce((prev, { complexity }) => +prev + +complexity, 0),
            cards: complexities.filter(({ complexity }) => complexity > 0),
        };
        totalComplexity += estimateTotals[key].total;
    }
    const devCount = numberOfDevs;
    // pick a card
    // calculate the days required to finish
    // calculate how many days are left for week
    // pick another card until time in week is close to zero
    const players = [];
    for (let i = 0; i < +devCount; i++) {
        players.push({
            name: `Dev ${i}`,
            averageDelivery: avgSpeed,
            weeks: [],
        });
    }
    for (const key of keys) {
        let currentWeek = 0;
        const cards = estimateTotals[key].cards;
        while (cards.length > 0) {
            const cardIndex = Math.floor(Math.random() * cards.length);
            const card = cards[cardIndex];
            // player selection
            const [player, { workable, overage }] = getPlayer(players, currentWeek, card, +avgSpeed, hoursPerWeek);
            if (!player) {
                // If no player is free to pick up a card
                // the week is over
                currentWeek++;
            }
            else {
                player.weeks[currentWeek] = player.weeks[currentWeek] || [];
                player.weeks[currentWeek].push({
                    ...card,
                    player: player.name,
                    epic: key,
                    hours: workable,
                });
                // do this recursively
                addOverages(player, currentWeek, key, overage, card, hoursPerWeek);
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
    return { totalComplexity, weeks };
}
exports.estimate = estimate;
