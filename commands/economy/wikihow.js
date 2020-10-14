const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const Discord = require('discord.js');
const fs = require('fs');

let rawdata = fs.readFileSync('./include/assets/json/wikihow.json');
let Game = JSON.parse(rawdata);

module.exports = {
    name: 'wikihow',
    description: "Starts a simple game of guessing of wiki-how images",
    aliases: ['wh'],
    usage: '',
    cooldown: 30,
    args: 0,
    catergory: 'Economy',
    async execute(message, args, client) {
        try {
            let Questions = Game.wikihows;
            let Question = Questions[Math.floor(Math.random() * Questions.length)];

            let Luck = Util.NotNumberCheck(await db.get(`${message.author.id}_luck`));
            Luck += Util.NotNumberCheck(await db.get(`${message.author.id}_baseluck`));

            let Message = ""
            for (let i = 0; i < Question["choices"].length; i++) {
                Message += `${Question["choices"][i]}\n`;
            }
            Message += `\nYou have **10 seconds** to answer the question!`;

            message.channel.send({
                embed: {
                    title: "What is the title of this wikiHow article?",
                    image: {
                        url: Question["image"]
                    },
                    description: Message,
                    color: "#8B0000",
                    footer: {
                        text: "Requested by " + message.author.tag,
                        icon_url: message.author.displayAvatarURL()
                    },
                    timestamp: new Date()
                }
            }).then(() => {
                message.channel.awaitMessages(response => response.author.id == message.author.id, {
                    max: 1,
                    time: 15000,
                    errors: ['time'],
                }).then((collected) => {
                    let Reward = Math.round(Math.random() * 1500);

                    if (Luck > 0) {
                        Luck = (Reward / 100) * Luck;
                    }

                    Reward += Luck;
                    if (isNaN(collected.first().content)) {
                        if (collected.first().content.toLowerCase() == Question["correct"]) {
                            db.add(`${message.author.id}_balance`, Math.round(Reward));
                            return message.channel.send({
                                embed: {
                                    title: "Correct Answer",
                                    description: `You managed to earn yourself **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**`,
                                    color: "#228B22",
                                    footer: {
                                        text: "Requested by " + message.author.tag,
                                        icon_url: message.author.displayAvatarURL()
                                    },
                                    timestamp: new Date()
                                }
                            });
                        }
                    }

                    return message.channel.send({
                        embed: {
                            title: "Wrong Answer",
                            description: `Your answer is **wrong**, better luck next time!`,
                            color: "#8B0000",
                            footer: {
                                text: "Requested by " + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });

                }).catch((err) => {
                    return message.reply('Please choose an answer next time!');
                });
            });

        }
        catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
