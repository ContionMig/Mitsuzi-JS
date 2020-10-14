const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');

let Heads = ['heads', 'head', 'h', 'top'];
let Tails = ['tails', 'tail', 't', 'buttom'];
let Links = ['https://i.imgur.com/SUpIkmJ.png', 'https://i.imgur.com/C4lYV1X.png'];

module.exports = {
    name: 'coinflip',
    description: "Play coinflip and bet some of your money",
    aliases: ['flip'],
    usage: ' [heads/tails] [betamount]',
    cooldown: 2,
    args: -1,
    catergory: 'Economy',
    async execute(message, args, client) {
        try {
            let Side = "h";
            if (isNaN(args[0])) {
                Side = args[0].toLowerCase();
            }
            else {
                return message.reply("Please use the proper usage for this command: ``coinflip heads 500``")
            }

            let Balance = await db.get(`${message.author.id}_balance`);
            let Amount = args[1];
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
                    Amount = Balance;
                }
            }

            if (Heads.indexOf(Side) > -1) {
                Side = 1;
            }
            else if (Tails.indexOf(Side) > -1) {
                Side = 0;
            }
            else {
                return message.reply("Please make sure you selected a proper side [heads/tails]!")
            }

            let Message = "";
            let EndedSide = Math.round(Math.random());
            if (EndedSide == Side) {
                if (Amount > 100) {
                    Amount = Math.round(Amount / 100 * 50);
                }

                db.add(`${message.author.id}_balance`, Amount);
                Message = `You Won **${Util.moneyFormat(Amount)}**, Goob Job!`
            }
            else {
                db.subtract(`${message.author.id}_balance`, Amount);
                Message = `You Lost **${Util.moneyFormat(Amount)}**, Tough Luck!`
            }

            return message.channel.send({
                embed: {
                    title: `Coinflip Machine`,
                    description: Message,
                    image: {
                        url: Links[EndedSide],
                    },
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
