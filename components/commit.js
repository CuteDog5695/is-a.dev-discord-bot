const User = require('../models/user');
const { Octokit } = require("@octokit/core");
require('dotenv').config();
function CommitChanges(id, subdomain, type, data) {
    const githubUser = User.findOne({ userid: id });
    const token = githubUser.gittoken;
    const username = githubUser.githubid;
    const email = githubUser.email;
    const octokit = new Octokit({
        auth: token
    })
    content = `{
        "owner": {
           "username": "${username}",
           "email": "${email}"
       },
       "record": {
           "${type}": ${data.toLowerCase()}
       }
   }
   `
    const record = Buffer.from(content).toString('base64');
    const commit = octokit.request('POST /repos/{owner}/{repo}/contents/{path}', {
        owner: username,
        repo: 'register',
        path: `records/${subdomain}.json`,
        message: `Add ${type} record for ${subdomain}`,
        content: record,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    return commit;
}