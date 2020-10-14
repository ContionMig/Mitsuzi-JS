const { canModifyQueue } = require("../../util/MitUtil.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'nowplaying',
  description: "Show now playing song",
  aliases: ['np', 'current'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Music',
  async execute(message, args, client) {
    try {
      const queue = message.client.queue.get(message.guild.id);
      if (!queue) return message.reply("There is nothing playing.").catch(console.error);
      const song = queue.songs[0];

      let nowPlaying = new MessageEmbed()
        .setTitle("Now playing")
        .setDescription(`${song.title}\n${song.url}`)
        .setColor("#F8AA2A")
        .setAuthor("EvoBot")
        .setTimestamp();

      if (song.duration > 0) nowPlaying.setFooter(new Date(song.duration * 1000).toISOString().substr(11, 8));

      return message.channel.send(nowPlaying);
    } catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  }
};
