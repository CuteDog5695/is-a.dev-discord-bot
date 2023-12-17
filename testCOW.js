require('dotenv').config();
const { MailcowApiClient } = require("mailcow-api")
const mcc = new MailcowApiClient(process.env.MAILCOW_API_BASEURL, process.env.MAILCOW_API_KEY);

async function Domains() {
    const domains = await mcc.getDomains();
    return domains;
}

Domains()