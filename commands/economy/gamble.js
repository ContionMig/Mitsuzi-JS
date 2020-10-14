const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');

module.exports = {
    name: 'gamble',
    description: "Gamble in a basic dice game against the bot",
    aliases: ['gam'],
    usage: ' [betamount]',
    cooldown: 10,
    args: 1,
    catergory: 'Economy',
    async execute(message, args, client) {
        try {
            let Balance = await db.get(`${message.author.id}_balance`);
            let Amount = args[0];

            if (isNaN(Amount)) {
                if (Amount.toLowerCase() == "all" || Amount.toLowerCase() == "a") {
                    Amount = Balance;
                }
                else {
                    Amount = 1;
                }
            }
            else {
                Amount = Util.NotNumberCheck(Amount);
                if (Amount > Balance) {
                    return message.reply(`Please make sure you have **${Util.moneyFormat(Amount)}** to begin with!`);
                }
            }

            if (Amount < 500) {
                return message.reply("Please make sure you gamble with more than $500!");
            }

            let UserValue = Util.getRandomInt(1, 12);
            let BotValue = Util.getRandomInt(1, 12);

            let Message = "";
            if (UserValue > BotValue) {
                let Reward = Util.getRandomInt(Math.floor(Amount / 4), (Amount * 2));
                let Luck = Util.NotNumberCheck(await db.get(`${message.author.id}_luck`));
                Luck += Util.NotNumberCheck(await db.get(`${message.author.id}_baseluck`));

                if (Luck > 0) {
                    Luck = (Reward / 100) * Luck;
                }

                Reward += Luck;

                Message = `You have won **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**`;
                db.add(`${message.author.id}_balance`, Reward);
            }
            else {
                Message = `You have lost **${Util.moneyFormat(Amount)}**`;
                db.subtract(`${message.author.id}_balance`, Amount);
            }

            return message.channel.send({
                embed: {
                    title: `Dice Gamble`,
                    description: Message,
                    fields: [{
                        name: `${message.author.username}`,
                        value: `Rolled: \`${UserValue}\``,
                        inline: true,
                    },
                    {
                        name: `${client.user.username}`,
                        value: `Rolled: \`${BotValue}\``,
                        inline: true,
                    },
                    ],
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
