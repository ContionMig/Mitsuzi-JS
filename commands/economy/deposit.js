const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');

module.exports = {
  name: 'deposit',
  description: "Deposits your money into your safe",
  aliases: ['dep'],
  usage: ' [amount]',
  cooldown: 2,
  args: 1,
  catergory: 'Economy',
  async execute(message, args, client) {
    try {
      let Balance = Util.NotNumberCheck(await db.get(`${message.author.id}_balance`));
      
      let ServerPrefix = await db.get(`${message.guild.id}_prefix`);
      let CurrentBase = await db.get(`${message.author.id}_base`);

      if (CurrentBase > -1) {
        let Value = args[0];
        if (isNaN(Value)) {
          if (Value.toLowerCase() == "all" || Value.toLowerCase() == "a") {
            Value = Balance;
          }
          else {
            return message.reply("Please enter a proper amount you would like to deposit into your vault!")
          }
        }
        else {
          Value = Util.NotNumberCheck(Value);
          if (Value > Balance) {
            return message.reply("You do not have enough balance in your wallet to deposit into the vault!");
          }
        }

        await db.add(`${message.author.id}_vault`, Value);
        await db.subtract(`${message.author.id}_balance`, Value);

        let Message = `You deposited **${Util.moneyFormat(Value)}** to the safe from your wallet`;
        return message.channel.send({
          embed: {
            title: "Money Deposited",
            description: Message,
            color: "#8B0000",
            footer: {
              text: "Requested by " + message.author.tag,
              icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date()
          }
        });
      }
      else {
        message.reply(`Please purchase a property by doing **${ServerPrefix}base buy** to get yourself a vault/safe!`);
      }
    } catch (e) {
      console.error(e)
    }
  }
};
