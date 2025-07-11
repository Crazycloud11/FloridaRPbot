const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('request-supervision')
    .setDescription('Request a supervised moderation session'),

  async execute(interaction) {
    const trainerRoleId = '1391418395215396878'; // 🔧 Replace with actual Staff Trainer role ID
    const requestChannelId = '1391418396586934296'; // 🔧 Replace with supervision channel ID

    const trainee = interaction.user;
    const channel = await interaction.client.channels.fetch(requestChannelId);
    if (!channel) {
      return interaction.reply({
        content: '❌ Could not find the supervision request channel.',
        ephemeral: true,
      });
    }

    const acceptButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`accept_${trainee.id}`)
        .setLabel('Accept')
        .setStyle(ButtonStyle.Success)
    );

    const embed = new EmbedBuilder()
      .setTitle('📝 Supervision Request')
      .setDescription(`<@${trainee.id}> is requesting a supervised mod training session.\n<@&${trainerRoleId}>`)
      .setColor(0xffa500) // 🟧 Orange
      .setTimestamp();

    await channel.send({
      content: '📬 Training request received',
      embeds: [embed],
      components: [acceptButton],
    });

    await interaction.reply({
      content: '✅ Your supervision request has been sent to Staff Trainers.',
      ephemeral: true,
    });
  },

  async button(interaction) {
    const customId = interaction.customId;
    if (!customId.startsWith('accept_')) return;

    const traineeId = customId.split('_')[1];
    const trainer = interaction.user;

    try {
      const traineeUser = await interaction.client.users.fetch(traineeId);

      // 🔧 Customize instructions and image
      const instructions = `
🛡️ **Mod Training Instructions**
You’ll be monitored by a Staff Trainer while handling live moderation tasks.
Please be ready to respond to chat, handle joins, and issue disciplinary actions.
Ask questions if unsure, and be professional.

Once completed, you may be eligible for promotion to Trial Moderator.
`;

      const imageUrl = 'IMAGE_URL_HERE'; // 🔧 Replace with your training image URL

      const dmEmbed = new EmbedBuilder()
        .setTitle('✅ Training Accepted')
        .setDescription(`Your supervision request has been accepted by **${trainer.tag}**.`)
        .addFields({ name: 'Instructions', value: instructions })
        .setImage(imageUrl)
        .setColor(0xffa500) // 🟧 Orange
        .setTimestamp();

      await traineeUser.send({ embeds: [dmEmbed] });
      await interaction.reply({
        content: `📨 Accepted request. DM sent to <@${traineeId}>.`,
        ephemeral: true,
      });
    } catch (err) {
      console.error('Error sending DM:', err);
      await interaction.reply({
        content: '❌ Failed to send DM to the trainee.',
        ephemeral: true,
      });
    }
  },
};