require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
const deploy = require('./deploy-commands');

deploy(); // 📦 Deploy slash commands

const app = express();
app.get('/', (req, res) => res.send('FloridaRPBot is online'));
app.listen(3000, () => {
  console.log('🌐 Web server is live!');
  console.log('🔗 Uptime link: https://YOUR_UPTIME_URL_HERE'); // Replace with your actual bot URL
});

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  }
}

client.once(Events.ClientReady, async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const url = 'https://YOUR_UPTIME_URL_HERE'; // Replace with your actual bot URL
  try {
    const channel = await client.channels.fetch(process.env.STARTUP_CHANNEL);
    if (channel) {
      channel.send(`📡 FloridaRPBot is online!\n🔗 Uptime link: ${url}`);
    }
  } catch (err) {
    console.error('💥 Failed to send startup message:', err);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (command) await command.execute(interaction);
  } else if (interaction.isButton()) {
    const supervision = client.commands.get('request-supervision');
    if (supervision && supervision.button) {
      await supervision.button(interaction);
    }
  }
});

client.login(process.env.TOKEN);