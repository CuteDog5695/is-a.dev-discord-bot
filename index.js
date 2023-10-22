const fs = require("node:fs");
const path = require("node:path");
const staff = require("./models/staff.js");

const {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    EmbedBuilder,
    ActivityType,
} = require("discord.js");
const mongoose = require("mongoose");
const Sentry = require("@sentry/node");
const keepAlive = require("./components/webServer.js");
const HandleSelectMenu = require("./events/SelectEvent.js");
const HandleButtonEvent = require("./events/ButtonEvent.js");
const HandleModalEvent = require("./events/modal.js");
require("dotenv").config();

Sentry.init({
    dsn: "https://2854c55af6ab42ffb6f840091e3b235c@o575799.ingest.sentry.io/4505311662309376",

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

const mongoDB = process.env.MONGO_DB;
const token = process.env.DISCORD_TOKEN;
const status = process.env.STATUS;
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
        );
    }
}

client.on(Events.InteractionCreate, async (interaction) => {
    const command = interaction.client.commands.get(interaction.commandName);
    console.log(interaction.commandName);
    if (interaction.isStringSelectMenu()) {
        HandleSelectMenu(interaction);
        return;
    }
    if (interaction.isButton()) {
        HandleButtonEvent(interaction);
        return;
    }
    if (interaction.isModalSubmit()) {
        HandleModalEvent(interaction);
        return;
    }

    if (!command) {
        console.error(
            `No command matching ${interaction.commandName} was found.`,
        );
        return;
    }
    if (!await staff.findOne({ _id: interaction.user.id })
    ) {
        await interaction.reply({
            content: "You are not authorized to use this command!",
            ephemeral: true,
        });
        return;
    }
    


    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    }
});

client.once(Events.ClientReady, (c) => {
    client.user.setPresence({
        activities: [{ name: status, type: ActivityType.Custom }],
        status: "online",
    });

    console.log(`Ready! Logged in as ${c.user.tag}`);
});

mongoose
    .connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "is-a-dev-beta",
    })
    .then(() => {
        console.log("Connected to the database");
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error);
    });

client.login(token);
keepAlive(client);
