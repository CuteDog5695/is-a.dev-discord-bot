const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const mongoose = require("mongoose");
const keepAlive = require("./components/webserver.js");
const Discord = require("discord.js");

require("dotenv").config();

const mongoDB = process.env.MONGO_DB;

const token = process.env.DISCORD_TOKEN;
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}


client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    console.log(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    // React to the slect menu with the id delete_select
    if (interaction.customId === "delete_select") {
        console.log("delete_select");
        console.log(interaction.message.id);
        // Get the message that the select menu was used in
        const message = await interaction.channel.messages.fetch(interaction.message.id);
        // Get the message that the select menu was used in
        const messageToDelete = await interaction.channel.messages.fetch(interaction.values[0]);
        // Delete the message
        messageToDelete.delete();
        // Update the select menu to show that the message was deleted
        interaction.update({
            content: "Message deleted",
            components: [message.components[0]],
        });
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
        } else {
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    }
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

mongoose
    .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "is-a-dev" })
    .then(() => {
        console.log("Connected to the database");
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error);
    });

keepAlive();

// Log in to Discord with your client's token
client.login(token);
