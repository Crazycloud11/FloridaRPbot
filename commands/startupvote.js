const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ComponentType
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('startupvote')
    .setDescription('Initiate a vote to determine server startup readiness'),

  async execute(interaction) {
    const allowedChannelId = '1391418396884734066';
    const targetChannelId = '1391418395806793817';

    if (interaction.channelId !== allowedChannelId) {
      return interaction.reply({
        content: '❌ This command can only be used in the dispatch control channel.',
        ephemeral: true
      });
    }

    const voters = new Set();

    const voteEmbed = new EmbedBuilder()
      .setTitle('🗳️ Startup Vote')
      .setDescription('Click the button below if you’re ready to start the FloridaRP server.\n\n✅ Votes: **0/5**')
      .setColor('Orange');

    const voteButton = new ButtonBuilder()
      .setCustomId('startup_vote_button')
      .setLabel('Vote to Start')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(voteButton);

    // Send the vote panel to the target channel
    const targetChannel = await interaction.client.channels.fetch(targetChannelId);

    const voteMessage = await targetChannel.send({
      embeds: [voteEmbed],
      components: [row]
    });

    // Confirm to the user who triggered the command
    await interaction.reply({
      content: `✅ Vote panel sent to <#${targetChannelId}>.`,
      ephemeral: true
    });

    const collector = voteMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 5 * 60 * 1000 // 5 minutes
    });

    collector.on('collect', async i => {
      if (voters.has(i.user.id)) {
        return i.reply({
          content: '⚠️ You have already voted.',
          ephemeral: true
        });
      }

      voters.add(i.user.id);

      const updatedEmbed = EmbedBuilder.from(voteEmbed)
        .setDescription(`Click the button below if you’re ready to start the FloridaRP server.\n\n✅ Votes: **${voters.size}/5**`);

      await i.update({ embeds: [updatedEmbed], components: [row] });
    });

    collector.on('end', async () => {
      const disabledRow = new ActionRowBuilder().addComponents(
        ButtonBuilder.from(voteButton).setDisabled(true)
      );

      await voteMessage.edit({
        content: '⏱️ Voting session ended.',
        components: [disabledRow]
      });
    });
  }
};