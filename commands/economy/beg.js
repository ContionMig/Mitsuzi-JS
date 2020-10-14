const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
var randomnumber = require('random-number');

module.exports = {
    name: 'beg',
    description: "Beg for some money",
    aliases: ['b'],
    usage: '',
    cooldown: 5,
    args: 0,
    catergory: 'Economy',
    async execute(message, args, client) {
        try {
            let user = message.author;

            let Reward = Util.getRandomInt(1, 50);

            let Luck = Util.NotNumberCheck(await db.get(`${message.author.id}_luck`));
            Luck += Util.NotNumberCheck(await db.get(`${message.author.id}_baseluck`));

            if (Luck > 0) {
                Luck = (Reward / 100) * Luck;
            }

            Reward += Luck;

            const member = message.guild.members.cache.random(1)[0];
            Message = `A generous passer-by **(${member.user.username})** threw **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})** at you`;
            db.add(`${user.id}_balance`, Util.NotNumberCheck(Reward));

            return message.channel.send({
                embed: {
                    title: "Begging",
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
        catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
