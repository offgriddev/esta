"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRealisticDuration = void 0;
const date_fns_1 = require("date-fns");
function getNonWorkableHours(startDate, endDate) {
    let numOfWorkableHours = 0;
    for (let d = startDate; d < endDate; d = (0, date_fns_1.addDays)(d, 1)) {
        if (d.getDay() === 0 || d.getDay() === 6)
            numOfWorkableHours++;
    }
    return numOfWorkableHours * 24;
}
function getRealisticDuration(startDateStr, endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const durationInHours = (0, date_fns_1.differenceInHours)(endDate, startDate);
    const nonWorkableHours = getNonWorkableHours(startDate, endDate);
    const workableHours = durationInHours - nonWorkableHours;
    return Math.round((workableHours / 24.0) * 100) / 100;
}
exports.getRealisticDuration = getRealisticDuration;
