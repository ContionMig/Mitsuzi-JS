const { canModifyQueue } = require("../../util/MitUtil.js");

module.exports = {
  name: 'loop',
  description: "Toggle music loop",
  aliases: ['l'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Music',
  async execute(message, args, client) {
    try {
      const queue = message.client.queue.get(message.guild.id);
      if (!queue) return message.reply("There is nothing playing.").catch(console.error);
      if (!canModifyQueue(message.member)) return;

      // toggle from false to true and reverse
      queue.loop = !queue.loop;
      return queue.textChannel
        .send({
          embed: {
            title: `Loop is now ${queue.loop ? "**on**" : "**off**"}`,
            color: "#8B0000",
            footer: {
              text: "Requested by " + message.author.tag,
              icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date()
          }
        })
        .catch(console.error);
    } catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  }
};