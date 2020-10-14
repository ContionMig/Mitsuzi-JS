const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
var Filter = require('bad-words'),
filter = new Filter();

module.exports = {
  name: 'setbio',
  description: "Sets your personal bio for your profile",
  aliases: ['bio', 'about'],
  usage: ' [bio]',
  cooldown: 2,
  args: -1,
  catergory: 'Economy',
  async execute(message, args, client) {
    try {
      let Bio = args.join(" ");
      for (let i = 0; i < 20; i++) {
        Bio = Bio.replace("`", "");
      }

      if (Bio.length > 30) {
        return message.reply("Your bio can only be up to 30 characters!")
      }

      Bio = filter.clean(Bio);

      db.set(`${message.author.id}_bio`, Bio);
      let Message = `**Bio Set:** ${Bio}`;
      return message.channel.send({
        embed: {
          title: `Bio Set`,
          description: Message,
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
