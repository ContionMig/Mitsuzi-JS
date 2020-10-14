const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const Discord = require('discord.js');
var rAnimal = require("random-animal-name");

module.exports = {
    name: 'hunt',
    description: "Try your luck and hunt in an open field",
    aliases: ['h', 'hunting'],
    usage: '',
    cooldown: 10,
    args: 0,
    catergory: 'Economy',
    async execute(message, args, client) {
        try {
            let ServerPrefix = await db.get(`${message.guild.id}_prefix`);
            let HuntingRifle = Util.NotNumberCheck(await db.get(`${message.author.id}_huntingrifle`));
            if (HuntingRifle < 1) {
                return message.reply(`Please make sure you have a **hunting rifle**. You can purchase one by doing ${ServerPrefix}shop`);
            }

            let RifleAmmo = Util.NotNumberCheck(await db.get(`${message.author.id}_rifleammo`));
            if (RifleAmmo < 1) {
                return message.reply(`Please make sure you have **ammo** for your rifle. You can purchase one by doing ${ServerPrefix}shop`);
            }

            let Balance = parseInt(await db.get(`${message.author.id}_balance`));
            let Reward = Math.round(Math.random() * 300);
            let Luck = Util.NotNumberCheck(await db.get(`${message.author.id}_luck`));
            Luck += Util.NotNumberCheck(await db.get(`${message.author.id}_baseluck`));

            let Chances = Math.round(Math.random() * 12);
            if (Luck > 0) {
                Chances += Math.round(Luck / 100);
                Luck = (Reward / 100) * Luck;
            }

            Reward += Luck;
            switch (Chances) {
                case 0:
                    let Lose = Math.round(Math.random() * 1000);
                    if (Lose > Balance) {
                        Lose = Balance;
                    }
                    Message = `While making your way to the forest, your car **broke down**. You managed to get it repaired but lost **${Util.moneyFormat(Lose)}**`;
                    db.subtract(`${message.author.id}_balance`, Reward);
                    break;
                case 1:
                    Message = `You found a **${rAnimal()}** and managed to kill it. However, you **broke** your gun after falling down and hitting a rock. You then sold it for **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**`;
                    db.subtract(`${message.author.id}_huntingrifle`, 1);
                    db.add(`${message.author.id}_balance`, Reward);
                    break;
                case 2:
                    Message = `After spending a few hours in the forest, you **didn't find anything**`;
                    break;
                default:
                    Message = `You managed to kill a **${rAnimal()}**. You then sold it for **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**`;
                    db.add(`${message.author.id}_balance`, Reward);
                    break;
            }

            db.subtract(`${message.author.id}_rifleammo`, 1);
            const HuntEmbed = new Discord.MessageEmbed()
                .setColor('#8B0000')
                .setTitle('Hunting Machine')
                .setDescription(Message)
                .setTimestamp()
                .setFooter("Requested by " + message.author.tag);

            return message.channel.send(HuntEmbed);
        }
        catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
