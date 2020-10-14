const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'mine',
    description: "Mines using your base's mining rig",
    aliases: ['mining'],
    usage: '',
    cooldown: 5,
    args: 0,
    catergory: 'Economy',
    async execute(message, args, client) {
        try {
            let rawdata = await fs.readFileSync('./include/assets/json/game.json');
            let Game = JSON.parse(rawdata);

            let Upgrades = Game.data["Upgrades"];
            let Bases = Game.data["Bases"];

            let ServerPrefix = await db.get(`${message.guild.id}_prefix`);
            let CurrentBase = await db.get(`${message.author.id}_base`);
            if (CurrentBase > -1) {
                let MiningKit = Util.NotNumberCheck(await db.get(`${message.author.id}_miningkit`));
                if (MiningKit == 0) {
                    return message.reply(`Please purchase a **mining kit** using \`\`${ServerPrefix}upgrade\`\`!`)
                }
                else {
                    let Bonus = MiningKit * Game.upgrades['miningkit'].upgrade;

                    let Luck = Util.NotNumberCheck(await db.get(`${message.author.id}_luck`));
                    Luck += Util.NotNumberCheck(await db.get(`${message.author.id}_baseluck`));
                    if (Luck > 0) {
                        Luck = (Bonus / 100) * Luck;
                    }

                    Bonus += Luck;

                    let NumbersArray = [];
                    let Random = Math.floor(Math.random() * 2);
                    for (let i = 0; i < 3; i++) {
                        NumbersArray.push(Util.getRandomInt(100, 999));
                    }

                    let Message = `You picked up your mining rig in base and decided to start mining. You have 30 seconds to try to guess the hash! Here are the possible hashes\n\n\`\`${NumbersArray[0]}\`\` \`\`${NumbersArray[1]}\`\` \`\`${NumbersArray[2]}\`\``
                    message.channel.send({
                        embed: {
                            title: "Mining Machine",
                            description: Message,
                            color: "#8B0000",
                            footer: {
                                text: "Requested by " + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    }).then(() => {
                        message.channel.awaitMessages(response => (response.author.id == message.author.id) && (!isNaN(response.content) && (response.content.length > 2) && (response.content == NumbersArray[Random])), {
                            max: 1,
                            time: 30000,
                            errors: ['time'],
                        }).then((collected) => {
                            db.add(`${message.author.id}_balance`, Math.round(Bonus));
                            return message.channel.send({
                                embed: {
                                    title: "Mining Machine",
                                    description: `You managed to guess the hash before anyone else! Enjoy your earnings **${Util.moneyFormat(Bonus - Luck)} +(${Util.moneyFormat(Luck)})**`,
                                    color: "#8B0000",
                                    footer: {
                                        text: "Requested by " + message.author.tag,
                                        icon_url: message.author.displayAvatarURL()
                                    },
                                    timestamp: new Date()
                                }
                            });
                        }).catch((err) => {
                            if (err) { console.log(err); }
                            return message.channel.send('Another miner managed to guess the hashrate faster than you! Please be faster next time!');
                        });
                    });
                }
            }
            else {
                return message.reply("Please purchase a base and purchase a mining kit to use this command!");
            }
        }
        catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
