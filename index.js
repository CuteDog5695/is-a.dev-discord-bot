const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const keepAlive = require('./components/webserver.js')


require('dotenv').config();

const mongoDB = process.env.MONGO_DB;


const token = process.env.DISCORD_TOKEN;
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

const collector = new Discord.InteractionCollector(client, { 
	componentType: 'SELECT_MENU' 
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
    console.log(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	//react to the select menu interaction with the id delete_select
	collector.on('collect', async (interaction) => {
		if (interaction.customID === 'delete_select') {
		  const selectedValue = interaction.values[0]; // Assuming it's a single-select menu
		  await interaction.reply(`You selected: ${selectedValue}`);
		  await interaction.message.delete();
		}
	});
	  
	  // Handle errors
	collector.on('end', (collected, reason) => {
		if (reason === 'time') {
		  console.log('Interaction collector ended due to time.');
		} else {
		  console.log('Interaction collector ended for another reason.');
		}
	});

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});
// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'is-a-dev' })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(error => {
    console.error('Error connecting to the database:', error);
  });
keepAlive();  
// Log in to Discord with your client's token
client.login(token);