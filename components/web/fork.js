const User = require("../../models/user");
const { Octokit } = require("@octokit/core");
require("dotenv").config();
const Sentry = require("@sentry/node");

const forkRepo = async (username, token) => {
    try {
        // Fork the repository
        const respository = "is-a-dev";
        const octokit = new Octokit({
            auth: token,
        });

        const forked = await octokit.request("POST /repos/{owner}/{repo}/forks", {
            owner: username,
            repo: respository,
            name: "register",
            default_branch_only: true,
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });
        const cloneResponse = forked.data.clone_url;
        if (process.env.DEBUG) {
            console.log("FORKED REPO: " + cloneResponse);
        }
        return cloneResponse;
    } catch (error) {
        console.log(error);
    }
};

async function WebFork(username, apikey) {
    const token = githubUser.gittoken;
    Sentry.setUser({ Discord: id });
    const responce = await forkRepo(token, guild);
    return responce;
}
exports.WebFork = WebFork;
