const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');

module.exports = {
  name: 'withdraw',
  description: "Withdraws your money from your safe",
  aliases: ['with'],
  usage: ' [amount]',
  cooldown: 2,
  args: 1,
  catergory: 'Economy',
  async execute(message, args, client) {
    try {
      let Balance = Util.NotNumberCheck(await db.get(`${message.author.id}_vault`));

      let Value = args[0];
      if (isNaN(Value)) {
        if (Value.toLowerCase() == "all" || Value.toLowerCase() == "a") {
          Value = Balance;
        }
        else {
          return message.reply("Please enter a proper amount you would like to withdraw from your vault!")
        }
      }
      else {
        Value = Util.NotNumberCheck(Value);
        if (Value > Balance) {
          return message.reply("You do not have enough balance in your safe to withdraw from!");
        }
      }
      
      db.add(`${message.author.id}_balance`, Value);
      db.subtract(`${message.author.id}_vault`, Value);

      let Message = `You withdrawed **${Util.moneyFormat(Value)}** to your wallet from your safe`;
      return message.channel.send({
        embed: {
          title: "Money Withdrawed",
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
