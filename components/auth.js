require("dotenv").config();

const GITHUB_ID = process.env.GITHUB_ID;
const SERVER_URL = process.env.SERVER_URL;

function getAccessToken(DiscordID) {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_ID}&scope=public_repo%20user:email&redirect_uri=https://${SERVER_URL}/auth/handler?discordId=${discordId}`;
    return authUrl;
}

exports.getAccessToken = getAccessToken;
