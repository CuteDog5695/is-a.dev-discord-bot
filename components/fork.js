const User = require('../models/user');
const fetch = require('node-fetch');
require('dotenv').config();

const forkRepoAndCreateBranch = async (username, repoName, branchName, token) => {
  try {
    // Fork the repository
    const forkResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}/forks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });

    if (!forkResponse.ok) {
      throw new Error(`Failed to fork the repository: ${forkResponse.status} ${forkResponse.statusText}`);
    }

    const forkedRepoUrl = (await forkResponse.json()).clone_url;

    // Clone the forked repository
    const cloneResponse = await fetch(forkedRepoUrl);
    // Handle cloning logic here

    // Create a new branch
    const createBranchResponse = await fetch(`https://api.github.com/repos/${cloneResponse}/git/refs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': {token}
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
