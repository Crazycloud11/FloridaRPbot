const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('servershutdown')
    .setDescription('Announces server shutdown and session length'),

  async execute(interaction) {
    const allowedChannelId = '1391418396884734066';
    const targetChannelId = '1391418395806793817';

    if (interaction.channelId !== allowedChannelId) {
      return interaction.reply({
        content: '❌ This command must be used in the dispatch control channel.',
        ephemeral: true
      });
    }

    const shutdownTimestamp = Math.floor(Date.now() / 1000);
    const sessionStart = interaction.client.sessionStartTime;
    let durationText = 'Unknown (startup not recorded)';

    if (sessionStart) {
      const durationSeconds = shutdownTimestamp - sessionStart;
      const hours = Math.floor(durationSeconds / 3600);
      const minutes = Math.floor((durationSeconds % 3600) / 60);
      durationText = `${hours}h ${minutes}m`;
    }

    const embed = new EmbedBuilder()
      .setTitle('🔻 Server Shutdown')
      .setDescription(
        `Florida State RP is now shutting down.\nThank you for participating!\n\n` +
        `🕒 **Shutdown Time:** <t:${shutdownTimestamp}:F>\n` +
        `⏱️ **Session Length:** ${durationText}`
      )
      .setColor('Orange')
      .setImage('https://media.discordapp.net/attachments/1390126350928707595/1391934046149284061/sD.png?ex=686db319&is=686c6199&hm=995b56999fc2e0bbb4ef6a2c5731fb301499abed5b5b1a7accdc45701e4d1648&=&format=webp&quality=lossless&width=1189&height=589') // optional
      .setFooter({ text: '🚦 Dispatch System' });

    const targetChannel = await interaction.client.channels.fetch(targetChannelId);
    await targetChannel.send({ content: '@everyone', embeds: [embed] });

    await interaction.reply({
      content: '✅ Shutdown posted successfully.',
      ephemeral: true
    });
  }
};