const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const request = require('node-superfetch');
const Discord = require('discord.js');
const fs = require("fs");

let rawdata = fs.readFileSync('./include/assets/json/fishes.json');
let body = JSON.parse(rawdata);

module.exports = {
    name: 'fish',
    description: "Try your luck and fish in a open lake",
    aliases: ['fishing', 'f'],
    usage: '',
    cooldown: 10,
    args: 0,
    catergory: 'Economy',
    async execute(message, args, client) {
        try {
            let ServerPrefix = await db.get(`${message.guild.id}_prefix`);
            let FishingRod = Util.NotNumberCheck(await db.get(`${message.author.id}_fishingrod`));
            if (FishingRod < 1) {
                return message.reply(`Please make sure you have a **fishing rod**. You can purchase one by doing ${ServerPrefix}shop`);
            }

            let FishBait = Util.NotNumberCheck(await db.get(`${message.author.id}_fishbait`));
            if (FishBait > 0) {
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

                let Fish = body[Math.floor(Math.random() * body.length)];

                let Message = "";
                let Location = Fish["NOAA Fisheries Region"].split(",");
                switch (Chances) {
                    case 0:
                        let Lose = Math.round(Math.random() * 1000);
                        if (Lose > Balance) {
                            Lose = Balance;
                        }
                        Message = `You tried to make your way to **${Location[Math.floor(Math.random() * Location.length)]}**, but your car broke down. After calling your car company, you had to pay **${Util.moneyFormat(Lose)}** and managed to catch a bus home.`;
                        db.subtract(`${message.author.id}_balance`, Reward);
                        break;
                    case 1:
                        Message = `You **broke** your **fishing rod**, but managed to catch a **${Fish["Scientific Name"]}**. You then sold it for **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**`;
                        db.subtract(`${message.author.id}_fishingrod`, 1);
                        db.add(`${message.author.id}_balance`, Reward);
                        break;
                    case 2:
                        Message = `After spending a few hours in the **${Location[Math.floor(Math.random() * Location.length)]}**, you **did not managed** to catch any fishes`;
                        break;
                    default:
                        Message = `You managed to catch a **${Fish["Scientific Name"]}**, you then sold it for **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**`;
                        db.add(`${message.author.id}_balance`, Reward);
                        break;
                }

                db.subtract(`${message.author.id}_fishbait`, 1);
                const FishEmbed = new Discord.MessageEmbed()
                    .setColor('#8B0000')
                    .setTitle('Fishing Machine')
                    .setDescription(Message)
                    .setTimestamp()
                    .setFooter("Requested by " + message.author.tag);

                if (Chances != 0 && Chances != 2) {
                    FishEmbed.setThumbnail(Fish['Species Illustration Photo']['src']);
                }

                return message.channel.send(FishEmbed);
            }
            else {
                return message.reply(`Please make sure you buy a fish bait before going fishing by doing \`\`${ServerPrefix}shop\`\``)
            }
        }
        catch (err) {
            return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
};
