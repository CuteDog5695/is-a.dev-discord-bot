const express = require("express");
const fs = require("fs");
const multer = require("multer");
const fetch = require("node-fetch");
const { EmbedBuilder, WebhookClient } = require("discord.js");
const { Octokit } = require("@octokit/rest");
const User = require("../models/user.js");
const Prdata = require("../models/prdata.js");
const ejs = require("ejs");
const { getServers } = require("dns/promises");
require("dotenv").config();



const GITHUB_ID = process.env.GITHUB_ID;
const GITHUB_SECRET = process.env.GITHUB_SECRET;

const upload = multer();
const server = express();
server.set('view engine', 'ejs');


server.get("/auth/handler", async (req, res) => {
    const code = req.query.code;
    const discordId = req.query.discordId;

    const response = await fetch(`https://github.com/login/oauth/access_token?client_id=${GITHUB_ID}&client_secret=${GITHUB_SECRET}&code=${code}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    const data = await response.json();

    const accessToken = data.access_token;

    // get user info
    const userResponse = await fetch("https://api.github.com/user", {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const userData = await userResponse.json();
    const username = userData.login;

    // get user email
    const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const emailData = await emailResponse.json();
    const email = emailData[0].email;

    if (await User.findOne({ userid: discordId })) {
        await User.replaceOne({ userid: discordId }, { gittoken: accessToken });

        res.send("You are already logged in!");
        return;
    }

    await User.create({
        userid: discordId,
        githubid: username,
        email: email,
        gittoken: accessToken,
    });
    res.render('loggedin', { username });
    
});

server.get("/guides/forwarder", (req, res) => {
    // get query params from url and store in variables
    const email = req.query.email;
    const subdomain = req.query.domain;
    res.render('emailforwarder', { email, subdomain });
});

server.post("/api/email", upload.none(), (req, res) => {
    const body = req.body;

    console.log(`From: ${body.from}`);
    console.log(`To: ${body.to}`);
    console.log(`Subject: ${body.subject}`);
    console.log(`Text: ${body.text}`);

    // send to discord webhook
    const webhookClient = new WebhookClient({ url: process.env.webhook });

    const embed = {
        type: "rich",
        author: {
            name: `${body.from}`,
        },
        title: `${body.subject}`,
        description: `${body.text}`,
        color: "#0096ff",
    };

    webhookClient.send({
        username: "is-a.dev Email",
        avatarURL: "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png",
        embeds: [embed],
    });

    return res.status(200).send();
});

// Notify API
server.get('/pr/merged/:pr', function(req, res){
    var pr = req.params.pr;
    const BOT_TOKEN = process.env.BOT_TOKEN
    const octokit = new Octokit({
        auth: BOT_TOKEN
    })
    if (pr) {
        octokit.pulls.get({
            owner: 'is-a-dev',
            repo: 'register',
            pull_number: pr
        }).then(async ({ data }) => {
            if (data.merged == true) {
                const PRD = await Prdata.findOne({ prid: pr })
                if (PRD.merged == true) {
                    res.send('PR is already merged!')
                } else {
                    await Prdata.replaceOne({ prid: pr }, { merged: true })
                    await fetch('https://raw.githubusercontent.com/is-a-dev/team-docs/main/pr-merged.md')
                    .then(response => response.text())
                    .then(async data => {
                        // Do something with your data
                        await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
                            owner: 'is-a-dev',
                            repo: 'register',
                            issue_number: pr,
                            body: data
                        })
                    });

                    res.send('PR is now merged!')
                }
            } else {
                res.send('PR is not merged!')
            }
        })
    }
})

function keepAlive() {
    server.listen(3000, () => {
        console.log("Server is ready.");
    });
}

module.exports = keepAlive;
