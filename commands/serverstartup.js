const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverstartup')
    .setDescription('Announces server startup with timestamp'),

  async execute(interaction) {
    const allowedChannelId = '1391418396884734066';
    const targetChannelId = '1391418395806793817';

    if (interaction.channelId !== allowedChannelId) {
      return interaction.reply({
        content: '❌ This command must be used in the dispatch control channel.',
        ephemeral: true
      });
    }

    const startupTimestamp = Math.floor(Date.now() / 1000);
    interaction.client.sessionStartTime = startupTimestamp;

    const embed = new EmbedBuilder()
      .setTitle('📡 Server Startup')
      .setDescription(
        `Florida State RP is now starting!\nJoin Code: \`RPinFL\`\n\n` +
        `🕒 **Startup Time:** <t:${startupTimestamp}:F>\n` +
        `⏱️ **Time Since Startup:** <t:${startupTimestamp}:R>`
      )
      .setColor('Orange')
      .setImage('https://media.discordapp.net/attachments/1390126350928707595/1391934045826580510/sD_1.png?ex=686db319&is=686c6199&hm=a6c46e98464c5ca4312ca9319c3f23f6e4f1c373da87fce8c5d3d7165070050f&=&format=webp&quality=lossless&width=1189&height=589') // optional
      .setFooter({ text: '🚦 Dispatch System' });

    const targetChannel = await interaction.client.channels.fetch(targetChannelId);
    await targetChannel.send({ content: '@everyone', embeds: [embed] });

    await interaction.reply({
      content: '✅ Startup posted successfully.',
      ephemeral: true
    });
  }
};