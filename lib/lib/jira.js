"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIssueChangelog = exports.getIssue = void 0;
const undici_1 = require("undici");
function getHeaders(username, password) {
    const creds = Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');
    return {
        authorization: `Basic ${creds}`,
        'Content-Type': 'application/json',
        Accept: '*/*'
    };
}
async function getIssue(config) {
    const headers = getHeaders(config.username, config.password);
    const url = `${config.host}/rest/api/3/issue/${config.key}`;
    const res = await (0, undici_1.request)(url, {
        headers
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
