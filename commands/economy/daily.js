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
  name: 'daily',
  description: "Get your daily ( 12 hour ) rewards",
  aliases: ['reward'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Economy',
  async execute(message, args, client) {
    try {
      let user = message.author;

      let timeout = 43200000;
      let LastDaily = Util.NotNumberCheck(await db.get(`${user.id}_daily`));

      var options = { min: 500, max: 5500, integer: true }
      let Reward = randomnumber(options);

      let CurrentTimeStamp = new Date().getTime();
      let Message = `Please wait for **${Util.msToTime(timeout - (CurrentTimeStamp - LastDaily))}** before getting your daily reward again`;
      if (((CurrentTimeStamp - LastDaily) > timeout) || !LastDaily) {
        Message = `You got **${Util.moneyFormat(Reward)}** daily credits.`;
        db.add(`${user.id}_balance`, Reward);
        db.set(`${user.id}_daily`, CurrentTimeStamp);
      }

      return message.channel.send({
        embed: {
          title: "Daily Rewards",
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
