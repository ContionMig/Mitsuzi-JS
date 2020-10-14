const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');

module.exports = {
    name: 'pay',
    description: "Pay a specific amount to someone else",
    aliases: ['give', 'donate '],
    usage: ' [user] [amount]',
    cooldown: 2,
    args: 2,
    catergory: 'Economy',
    async execute(message, args, client) {
        try {
            let Amount = 0;

            if (!isNaN(args[0])) {
                Amount = Util.NotNumberCheck(args[0]);
            }
            else if (!isNaN(args[1])) {
                Amount = Util.NotNumberCheck(args[1]);
            }

            if (Amount < 2500) {
                return message.reply("You can't transfer less than $2,500 to someone!")
            }

            let UserBalance = await db.get(`${message.author.id}_balance`);
            if (UserBalance < Amount) {
                return message.reply("You can't transfer more than what you have!");
            }

            if (!message.mentions.members.first()) {
                return message.reply("Please make sure you mentioned someone valid!");
            }

            let User = message.mentions.members.first().user;
            let TransectionAmount = Math.floor((Amount / 100) * 5);

            db.add(`${User.id}_balance`, Math.floor(Amount - TransectionAmount));
            db.subtract(`${message.author.id}_balance`, Math.floor(Amount));

            let Message = ""; 
            Message += `**User:**     ${User.username}\n`;
            Message += `**Amount:**   ${Util.moneyFormat(Amount - TransectionAmount)}\n`;
            Message += `**Fee (5%):** ${Util.moneyFormat(TransectionAmount)}\n`;

            return message.channel.send({
                embed: {
                    title: "Paid User",
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
