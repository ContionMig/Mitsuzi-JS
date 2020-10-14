const { canModifyQueue } = require("../../util/MitUtil.js");

module.exports = {
  name: 'resume',
  description: "Resume currently playing music",
  aliases: ['r', 'continue'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Music',
  async execute(message, args, client) {
    try {
      const queue = message.client.queue.get(message.guild.id);
      if (!queue) return message.reply("There is nothing playing.").catch(console.error);
      if (!canModifyQueue(message.member)) return;

      if (!queue.playing) {
        queue.playing = true;
        queue.connection.dispatcher.resume();
        return queue.textChannel.send({
          embed: {
            description: `▶ ${message.author} resumed the music!`,
            color: "#8B0000",
            footer: {
              text: "Requested by " + message.author.tag,
              icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date()
          }
        }).catch(console.error);
      }

      return message.reply("The queue is not paused.").catch(console.error);
    } catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  }
};
