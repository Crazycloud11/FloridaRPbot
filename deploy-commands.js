const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
require('dotenv').config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1391906123514249216';
const GUILD_ID = '1391418395114733680'; // Testing only in one server

const commands = [];

const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
  .then(() => console.log('✅ Slash commands registered to server'))
  .catch(console.error);