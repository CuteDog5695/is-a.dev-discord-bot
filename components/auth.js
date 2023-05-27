require('dotenv').config();
const fetch = require('node-fetch');
const GITHUB_ID = process.env.GITHUB_ID;
const GITHUB_SECRET = process.env.GITHUB_SECRET;
const SERVER_URL = process.env.SERVER_URL;

function getAccessToken(DiscordID) {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_ID}&scope=public_repo%20user:email&redirect_uri=https://${SERVER_URL}/auth/handler?DiscordID=${DiscordID}`;
    return authUrl;
}

exports.getAccessToken = getAccessToken;


