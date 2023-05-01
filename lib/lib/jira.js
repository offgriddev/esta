"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIssueChangelog = exports.getIssue = void 0;
const undici_1 = require("undici");
function getHeaders(username, password) {
    return {
        Authentication: `Basic ${username}:${password}`,
        'Content-Type': 'application/json'
    };
}
async function getIssue(config) {
    const res = await (0, undici_1.request)(`${config.host}/rest/api/3/issue/${config.key}`, {
        headers: getHeaders(config.username, config.password)
    });
    return res.body.json();
}
exports.getIssue = getIssue;
async function getIssueChangelog(config) {
    const res = await (0, undici_1.request)(`${config.host}/rest/api/3/issue/${config.key}/changelog`, {
        headers: getHeaders(config.username, config.password)
    });
    return res.body.json();
}
exports.getIssueChangelog = getIssueChangelog;
