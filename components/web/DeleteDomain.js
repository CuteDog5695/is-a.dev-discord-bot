const { Octokit } = require("@octokit/rest");
async function DeleteDomain(apikey, username, email, domain) {
    let sha;
    let file;
    try {
        file = await fetch(`https://api.github.com/repos/${username}/register/contents/domains/${domain}.json`)
        .then((res) => res.json())
        .catch((err) => {
            console.log(err);
        });
        sha = file.sha;
    }
    catch (e) {
        console.log(e);
        return { "error": "Can't locate file." };
    }
    let octokit = new Octokit({
        auth: apikey,
    });
    try {
        let commit = await octokit.repos.deleteFile({
            owner: username,
            repo: "register",
            path: "domains/" + domain + ".json",
            message: `Delete ${domain}.is-a.dev`,
            sha: sha,
            committer: {
                name: username,
                email: email,
            },
        });
    }
    catch (e) {
        console.log(e);
        return { "error": "Error deleting domain" };
    }
    try {
        let existingPullRequests = await octokit.pulls.list({
            owner: "is-a-dev",
            repo: "register",
            state: "open",
            head: `${username}:main`,
            base: "main",
        });
    
        if (existingPullRequests.data.length > 0) {
            // Pull request already exists, return an error or handle it accordingly
            return { "error": "A pull request already exists." };
        }
        let pr = await octokit.pulls.create({
            owner: "is-a-dev",
            repo: "register",
            title: `BETA: Delete ${domain.toLowerCase().replace(/\.[^/.]+$/, "")}.is-a.dev`,
            head: `${username}:main`,
            base: "main",
            body: `Deleted \`${domain.toLowerCase().replace(/\.[^/.]+$/, "")}.is-a.dev\` using the site.`,
        });
        let PrUrl = pr.data.html_url;
        return { "prurl": PrUrl };
    }
    catch (e) {
        console.log(e);
        return { "error": "Error creating pull request." };
    }

}

exports.DeleteDomain = DeleteDomain;