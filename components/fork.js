const User = require('../models/user');
const { Octokit } = require("@octokit/core");
require('dotenv').config();

const forkRepo = async (token) => {
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
    return cloneResponse;
  } catch (error) {
    console.log(error);
  }

};

async function fork(id, interaction) {
    const githubUser = await User.findOne({ userid: id });
    const token = githubUser.gittoken;
    if (process.env.DEBUG) {
      console.log('FORK FUNCTION.');
      console.log('id: ' + id);
      console.log('token: ' + token);
  }
    const responce = await forkRepo(token);
    await interaction.editReply(`Forked repo: ${responce}`);
    return responce;


}
exports.fork = fork;
