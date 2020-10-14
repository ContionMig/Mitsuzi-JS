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
  name: 'addbal',
  description: "[OWNER] Adds balance to the targeted user",
  aliases: ['addbalance', 'givebal', 'addball'],
  usage: ' [user] [amount]',
  cooldown: 2,
  args: 2,
  catergory: 'Economy',
  hidden: true,
  async execute(message, args, client) {
    try {
      if (isNaN(args[1])) return;
      if (message.author.id !== ownerid) return;
      let user = message.mentions.members.first();

      db.add(`${user.id}_balance`, args[1]);
      let Message = "Added " + Util.moneyFormat(args[1]) + " to " + user.user.username;
      return message.channel.send({
        embed: {
          title: "[Owner] Added Balance",
          description: Message,
          color: "#8B0000",
          footer: {
            text: "Requested by " + message.author.tag,
            icon_url: message.author.displayAvatarURL()
          },
          timestamp: new Date()
        }
      });
    } catch (e) {
      console.error(e)
    }
  }
};
