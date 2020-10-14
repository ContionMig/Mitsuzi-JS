const { canModifyQueue } = require("../../util/MitUtil.js");
const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");
const db = require('../../util/Database.js');

module.exports = {
  name: 'queue',
  description: "Show the music queue and now playing.",
  aliases: ['q', 'playlist'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Music',
  async execute(message, args, client) {
    try {
      let ServerPrefix = await db.get(`${message.guild.id}_prefix`);
      const queue = message.client.queue.get(message.guild.id);
      if (!queue) return message.reply("There is nothing playing.").catch(console.error);

      let description = "```";
      for (let i = 0; i < queue.songs.length; i++) {
        if (i == 0) { description += `    ⬐ current track\n`; }
        description += `${i + 1}) ${escapeMarkdown(queue.songs[i].title)}\n`;
        if (i == 0) { description += `    ⬑ current track\n\n` }
      }


      let queueEmbed = new MessageEmbed()
        .setTitle("Music Queue")
        .setDescription(description)
        .setColor("#8B0000");

      const splitDescription = splitMessage(description, {
        maxLength: 2000,
        char: "\n",
        prepend: "```",
        append: "```"
      });

      if (splitDescription.length < 2) {
        splitDescription[0] += "```\n```The queue has " + queue.songs.length + " songs!\nUse " + ServerPrefix + "play to add more```";
      }
      else {
        splitDescription[0] += "\n```The queue has " + queue.songs.length + " songs!\nUse " + ServerPrefix + "play to add more```";
      }

      queueEmbed.setDescription(splitDescription[0]);
      message.channel.send(queueEmbed);
    } catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  }
};
