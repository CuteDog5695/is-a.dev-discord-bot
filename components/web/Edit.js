const { Octokit } = require("@octokit/rest");
async function EditDomain(subdomain, username, email, apikey, records) {
    let file = await fetch(`https://api.github.com/repos/${username}/register/contents/domains/${subdomain}.json`)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    });
    let sha = file.sha;
    let octokit = new Octokit({
        auth: apikey,
    });
    let data = records;
    
    let extractedData = {};
    for (const { type, value } of records) {
    if (extractedData[type]) {
        if (Array.isArray(extractedData[type])) {
        extractedData[type].push(value);
        } else {
        extractedData[type] = [extractedData[type], value];
        }
    } else {
        extractedData[type] = value;
    }
    }

    content = `{
    "owner": {
        "username": "${username}",
        "email": "${email}"
    },
    "record": ${JSON.stringify(extractedData)}
    }`;

    
    let record = Buffer.from(content).toString("base64");
    
    try {
        let commit = await octokit.repos.createOrUpdateFileContents({
            owner: username,
            repo: "register",
            path: "domains/" + subdomain + ".json",
            message: `feat(domain): ${subdomain}.is-a.dev`,
            content: record,
            sha: sha,
            committer: {
                name: username,
                email: email,
            },
            author: {
                name: username,
                email: email,
            },
        });

}
catch (e) {
        console.log(e);
        return { "error": "Error creating domain file." };
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
        return { "error": "A pull request for this domain already exists." };
    }
    let pr = await octokit.pulls.create({
        owner: "is-a-dev",
        repo: "register",
        title: `BETA: Update ${subdomain.toLowerCase().replace(/\.[^/.]+$/, "")}.is-a.dev`,
        head: `${username}:main`,
        base: "main",
        body: `Updated \`${subdomain.toLowerCase().replace(/\.[^/.]+$/, "")}.is-a.dev\` using the site.`,
    });
    let PrUrl = pr.data.html_url;
    return { "prurl": PrUrl };
}
catch (e) {
    console.log(e);
    return { "error": "Error creating pull request." };
}
    
    
  
}

exports.EditDomain = EditDomain;