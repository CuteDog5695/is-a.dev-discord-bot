const { Octokit } = require("@octokit/core");
require("dotenv").config();
const Sentry = require("@sentry/node");

const forkRepo = async (token) => {
    let forked;
    try {
        // Fork the repository
        const respository = "is-a-dev";
        const octokit = new Octokit({
            auth: token,
        });

        forked = await octokit.request("POST /repos/{owner}/{repo}/forks", {
            owner: "is-a-dev",
            repo: "register",
            name: "register",
            default_branch_only: true,
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });
        const cloneResponse = forked.data.html_url;
        if (process.env.DEBUG) {
            console.log("FORKED REPO: " + cloneResponse);
        }
        return cloneResponse;
    } catch (error) {
        console.log("ERROR: " + error);
        return error;
    }
};

async function WebFork(apikey) {
    const responce = await forkRepo(apikey);
    return responce;
}
exports.WebFork = WebFork;
