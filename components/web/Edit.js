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
    
    let data = [];
    
    if (Array.isArray(records)) {
        data = records.map((record) => processRecord(record));
    } else {
        data.push(processRecord(records));
    }
    
    let content = JSON.stringify({
        owner: {
            username: username,
            email: email,
        },
        record: data,
    });
    console.log(content);
    
    let record = Buffer.from(content).toString("base64");
    
    try {
        let commit = await octokit.repos.createOrUpdateFileContents({
            owner: username,
            repo: "register",
            path: `domains/${subdomain}.json`,
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

        // ...

    } catch (e) {
        console.log(e);
        return { "error": "Error creating domain file." };
    }

    // ...
}

function processRecord(record) {
    if (record.type === "A" || record.type === "MX") {
        record.value = record.value.split(",").map((s) => s.trim());
    } else {
        record.value = record.value.trim();
    }
    return record;
}

exports.EditDomain = EditDomain;
