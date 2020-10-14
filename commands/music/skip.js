const { canModifyQueue } = require("../../util/MitUtil.js");

module.exports = {
  name: 'skip',
  description: "Skip the currently playing song",
  aliases: [],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Music',
  async execute(message, args, client) {
    try {
      const queue = message.client.queue.get(message.guild.id);
      if (!queue)
        return message.reply("There is nothing playing that I could skip for you.").catch(console.error);
      if (!canModifyQueue(message.member)) return;

      queue.playing = true;
      queue.connection.dispatcher.end();
      queue.textChannel.send({
        embed: {
          description: `⏭ ${message.author} skipped the song`,
          color: "#8B0000",
          footer: {
            text: "Requested by " + message.author.tag,
            icon_url: message.author.displayAvatarURL()
          },
          timestamp: new Date()
        }
      }).catch(console.error);
    }
    catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  }
};
