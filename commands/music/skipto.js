const { canModifyQueue } = require("../../util/MitUtil.js");

module.exports = {
  name: 'skipto',
  description: "Skip to the selected queue number",
  aliases: ['st'],
  usage: ' [index]',
  cooldown: 2,
  args: 1,
  catergory: 'Music',
  async execute(message, args, client) {
    try {
      let ServerPrefix = await db.get(`${message.guild.id}_prefix`);

      if (isNaN(args[0]))
        return message
          .reply(`Usage: ${ServerPrefix}${module.exports.name} <Queue Number>`)
          .catch(console.error);

      const queue = message.client.queue.get(message.guild.id);
      if (!queue) return message.channel.send("There is no queue.").catch(console.error);
      if (!canModifyQueue(message.member)) return;

      if (args[0] > queue.songs.length)
        return message.reply(`The queue is only ${queue.songs.length} songs long!`).catch(console.error);

      queue.playing = true;
      if (queue.loop) {
        for (let i = 0; i < args[0] - 2; i++) {
          queue.songs.push(queue.songs.shift());
        }
      } else {
        queue.songs = queue.songs.slice(args[0] - 2);
      }
      queue.connection.dispatcher.end();
      queue.textChannel.send({
        embed: {
          description: `⏭ ${message.author} skipped ${args[0] - 1} songs`,
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
