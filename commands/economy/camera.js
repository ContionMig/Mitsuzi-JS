const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const Discord = require('discord.js');
const fs = require('fs');

const words = ['click', 'shutter', 'shoot', 'beep', 'bip', 'khat'];

module.exports = {
    name: 'camera',
    description: "Takes a picture using the camera and sells the image for cash",
    aliases: ['photo', 'cam'],
    usage: '',
    cooldown: 30,
    args: 0,
    catergory: 'Economy',
    async execute(message, args, client) {
        try {
            let ServerPrefix = await db.get(`${message.guild.id}_prefix`);
            let Camera = Util.NotNumberCheck(await db.get(`${message.author.id}_camera`));

            if (Camera > 0) {
                message.channel.send({
                    embed: {
                        title: "Get Ready...",
                        description: `*You ready your camera.....*`,
                        color: "#8B0000",
                        footer: {
                            text: "Requested by " + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                });

                await Util.delay(Util.getRandomInt(1000, 10000));
                const word = words[Math.floor(Math.random() * words.length)];

                let Luck = Util.NotNumberCheck(await db.get(`${message.author.id}_luck`));
                Luck += Util.NotNumberCheck(await db.get(`${message.author.id}_baseluck`));

                message.channel.send({
                    embed: {
                        title: "NOW!",
                        description: `TYPE \`${word.toUpperCase()}\` NOW!`,
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
                        time: 5000,
                        errors: ['time'],
                    }).then((collected) => {
                        let Reward = Math.round(Math.random() * 1500);
    
                        if (Luck > 0) {
                            Luck = (Reward / 100) * Luck;
                        }
    
                        Reward += Luck;
                        if (isNaN(collected.first().content)) {
                            if (collected.first().content.toLowerCase() == word) {
                                db.add(`${message.author.id}_balance`, Math.round(Reward));
                                return message.channel.send({
                                    embed: {
                                        title: "Good Job",
                                        description: `You managed to take the perfect picture and sold it for **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**`,
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
                                title: "Wrong Word",
                                description: `Please type in the proper word next time!`,
                                color: "#8B0000",
                                footer: {
                                    text: "Requested by " + message.author.tag,
                                    icon_url: message.author.displayAvatarURL()
                                },
                                timestamp: new Date()
                            }
                        });
    
                    }).catch((err) => {
                        return message.reply('You were too slow. better luck next time!');
                    });
                });
            }
            else {
                return message.reply(`Please purchase a camera from the **${ServerPrefix}shop**, before being able to take pictures!`);
            }
        }
        catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};