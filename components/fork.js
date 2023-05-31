const User = require('../models/user');
const { Octokit } = require("@octokit/core");
require('dotenv').config();

const forkRepoAndCreateBranch = async (username, repoName, branchName, token) => {
  try {
    // Fork the repository
    const octokit = new Octokit({
      auth: token
    })
    
    const forked = await octokit.request('POST /repos/{owner}/{repo}/forks', {
      owner: 'is-a-dev',
      repo: 'register',
      name: 'register',
      default_branch_only: true,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    const cloneResponse = forked.data.clone_url;
    if (process.env.DEBUG) {
      console.log('FORKED REPO: ' + cloneResponse);
    }

    // Create a new branch
    const createBranchResponse = await fetch(`https://api.github.com/repos/${cloneResponse}/git/refs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: 'main' // Replace 'main' with the commit or branch you want to base the new branch on
      })
    });

    if (!createBranchResponse.ok) {
      throw new Error(`Failed to create the new branch: ${createBranchResponse.status} ${createBranchResponse.statusText}`);
    }

    console.log(`New branch "${branchName}" created successfully.`);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

async function fork(branchName, id) {
    const username = 'is-a-dev';
    const repoName = 'register';
    const githubUser = await User.findOne({ userid: id });
    const token = githubUser.gittoken;
    if (process.env.DEBUG) {
      console.log('FORK FUNCTION.');
      console.log('branchName: ' + branchName);
      console.log('id: ' + id);
      console.log('token: ' + token);
  }
    forkRepoAndCreateBranch(username, repoName, branchName, token);


}
exports.fork = fork;
