const Util = require('../../util/MitUtil.js');

module.exports = {
  name: 'topinvite',
  description: "The bot will get the top invites from the server",
  aliases: ['ti', 'topinvites', 'invites'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Utility',
  async execute(message, args, client) {
    try {
      const invites = await message.guild.fetchInvites();
      const topTen = invites.filter((inv) => inv.uses > 0).sort((a, b) => b.uses - a.uses).first(10);

      let Description = "There are no invites, or none of them have been used!";
      if (topTen.length) {
        Description = topTen.map((inv) => `• **${inv.inviter.username}**'s invite **${inv.code}** has **${inv.uses.toLocaleString()}** uses.`).join("\n");
      }

      return message.channel.send({
        embed: {
          title: "Top Invites",
          description: Description,
          color: "#8B0000",
          footer: {
            text: "Requested by " + message.author.tag,
            icon_url: message.author.displayAvatarURL()
          },
          timestamp: new Date()
        }
      });
    } catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  }
};
