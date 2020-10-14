const { canModifyQueue } = require("../../util/MitUtil.js");

module.exports = {
  name: 'pause',
  description: "Pause the currently playing music",
  aliases: [],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Music',
  async execute(message, args, client) {
    try {
      const queue = message.client.queue.get(message.guild.id);
      if (!queue) return message.reply("There is nothing playing.").catch(console.error);
      if (!canModifyQueue(message.member)) return;

      if (queue.playing) {
        queue.playing = false;
        queue.connection.dispatcher.pause(true);
        return queue.textChannel.send({
          embed: {
            description: `⏸ ${message.author} paused the music.`,
            color: "#8B0000",
            footer: {
              text: "Requested by " + message.author.tag,
              icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date()
          }
        }).catch(console.error);
      }
    } catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  }
};
