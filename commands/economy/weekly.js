const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
var randomnumber = require('random-number');
const {
  prefix,
  token,
  ownerid,
  logchannelid,
  giphy
} = require('../../config.json');

module.exports = {
  name: 'weekly',
  description: "Get your weekly ( 7 days ) rewards",
  aliases: ['week'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Economy',
  async execute(message, args, client) {
    try {
      let user = message.author;

      let timeout = 604800000;
      let LastDaily = Util.NotNumberCheck(await db.get(`${user.id}_weekly`));

      var options = { min: 2000, max: 27500, integer: true }
      let Reward = randomnumber(options);

      let CurrentTimeStamp = new Date().getTime();
      let Message = `Please wait for **${Util.msToTime(timeout - (CurrentTimeStamp - LastDaily))}** before getting your weekly reward again`;
      if (((CurrentTimeStamp - LastDaily) > timeout) || !LastDaily) {
        Message = `You got **${Util.moneyFormat(Reward)}** weekly credits.`;
        db.add(`${user.id}_balance`, Reward);
        db.set(`${user.id}_weekly`, CurrentTimeStamp);
      }

      return message.channel.send({
        embed: {
          title: "Weekly Rewards",
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
