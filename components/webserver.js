const express = require("express")
const fs = require("fs");
const multer  = require('multer');
const fetch = require('node-fetch');
const { EmbedBuilder, WebhookClient } = require('discord.js');
const User = require('../models/user.js');
require('dotenv').config();

const GITHUB_ID = process.env.GITHUB_ID;
const GITHUB_SECRET = process.env.GITHUB_SECRET;


const upload = multer();

function readAndServe(path, res) {
  fs.readFile(path, function (err, data) {
      res.end(data);
  })
}

const server = express()

server.use(express.static("public"))

server.all("/", (req, res) => {
  res.send("Bot is running!")
  
})


server.get('/auth/handler', async (req, res) => {
  //get params from url
  //console.log(req.query);
  const code = req.query.code;
  const DiscordID = req.query.DiscordID;
  const response = await fetch(`https://github.com/login/oauth/access_token?client_id=${GITHUB_ID}&client_secret=${GITHUB_SECRET}&code=${code}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    });
    const data = await response.json();
    const accessToken = data.access_token;
    console.log(accessToken);
    // get user info
    const userResponse = await fetch('https://api.github.com/user', {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const userData = await userResponse.json();
    const username = userData.login;
    const avatar = userData.avatar_url;
    // get user email
    const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const emailData = await emailResponse.json();
    console.log(emailData);
    const email = emailData[0].email;

    if (await User.findOne({ userid: DiscordID })) {
        await User.replaceOne({ userid: DiscordID }, {
            gittoken: accessToken
        });
        res.send("You are already logged in!");
        return;
    }

    await User.create({
        userid: DiscordID,
        githubid: username,
        email: email,
        gittoken: accessToken
    });
    res.send("You have successfully logged in! You can close this tab now.");
});



server.post ('/api/email', upload.none(), (req, res) => {
  const body = req.body;

  console.log(`From: ${body.from}`);
  console.log(`To: ${body.to}`);
  console.log(`Subject: ${body.subject}`);
  console.log(`Text: ${body.text}`);
  // send to discord webhook
  const webhookClient = new WebhookClient({ url: process.env.webhook });
  const embed = {
    "type": "rich",
    "title": `Email from: ${body.from}`,
    "description": `Subject: ${body.subject}`,
    "color": 0x00FFFF,
    "fields": [
      {
        "name": `Message`,
        "value": `${body.text}`
      }
    ]
  }

  webhookClient.send({
    content: 'NEW EMAIL',
    username: 'IS-A-DEV-TECH-SUPPORT',
    avatarURL: 'https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png',
    embeds: [embed],
  });



  return res.status(200).send();
});


function keepAlive() {
  server.listen(3000, () => {
    console.log("Server is ready.")
  })
}

module.exports = keepAlive
