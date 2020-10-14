const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const {
  prefix,
  token,
  ownerid,
  logchannelid,
  giphy
} = require('../../config.json');

module.exports = {
  name: 'wallet',
  description: "Returns the user's wallet",
  aliases: ['wal', 'wall'],
  usage: ' [user - Optional]',
  cooldown: 2,
  args: 0,
  catergory: 'Economy',
  async execute(message, args, client) {
    try {
      let user = message.author;
      if (message.mentions.members.first()) {
        user = message.mentions.members.first().user;
      }

      let Balance = Util.NotNumberCheck(await db.get(`${user.id}_balance`));

      Message = `**Wallet**: ${Util.moneyFormat(Balance)}\n`;
      return message.channel.send({
        embed: {
          title: `${user.username} Wallet`,
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
