const fs = require('fs');
const Util = require('./MitUtil.js');
const db = require('./Database.js');

const { createCanvas, registerFont } = require('canvas');

var randomWords = require('random-words');
var rAnimal = require("random-animal-name");

async function MiniGames(message) {
    try {
        let rawdata = fs.readFileSync('./include/assets/json/jobs.json');
        let Game = JSON.parse(rawdata);
        let JobArray = Game["data"];

        let UserJob = await db.get(`${message.author.id}_job`);
        let Luck = Util.NotNumberCheck(await db.get(`${message.author.id}_luck`));
        Luck += Util.NotNumberCheck(await db.get(`${message.author.id}_baseluck`));

        let Reward = Math.round(Math.random() * Game.jobs[JobArray[UserJob]].earnings) + 1;
        let Bonus = Math.round(Math.random() * Game.jobs[JobArray[UserJob]].bonus) + 1;

        let Promotion = await db.get(`${message.author.id}_promotion`);
        if (Promotion > 0) {
            Reward += (Reward / 100) * (Promotion * 15);
        }

        if (Luck > 0) {
            Luck = (Reward / 100) * Luck;
            Reward += Luck;
        }

        if (Promotion < Game.jobs[JobArray[UserJob]].maxpromotion) {
            let PromotionRan = Math.round(Math.random() * (10 * Promotion));
            if (PromotionRan < 3) {
                await db.add(`${message.author.id}_promotion`, 1);
                await message.channel.send({
                    embed: {
                        title: "Promotion Accepted",
                        description: `After working for some time, your boss has decided to give you a **promotion**, enjoy the raise!`,
                        color: "#008000",
                        footer: {
                            text: "Requested by " + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                });
            }
        }

        let Words = randomWords({ exactly: 5 });
        let MiniGame = Math.round(Math.random() * 3);
        switch (MiniGame) {
            case 0:
                registerFont("./include/assets/fonts/Captcha.ttf", { family: 'Captcha' });
                const canvas = createCanvas(125, 32);
                const ctx = canvas.getContext('2d');
                const text = Util.makeid(5);
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.beginPath();
                ctx.strokeStyle = '#0088cc';
                ctx.font = '26px Captcha';
                ctx.rotate(-0.05);
                ctx.strokeText(text, 15, 26);
                await message.channel.send({
                    embed: {
                        title: "Captcha Puzzle",
                        description: `Please try to solve the captcha which appears below this message`,
                        color: "#8B0000",
                        image: {
                            url: 'attachment://captcha-quiz.png',
                        },
                        footer: {
                            text: "Requested by " + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date()
                    },
                    files: [{
                        attachment: canvas.toBuffer(),
                        name: 'captcha-quiz.png'
                    }]
                });

                const msgs = await message.channel.awaitMessages(res => res.author.id === message.author.id, {
                    max: 1,
                    time: 15000
                });

                if (!msgs.size) {
                    return message.channel.send({
                        embed: {
                            title: "Work Failed",
                            description: `You **did not** manage to solve the captcha **in time**, better luck next time!`,
                            color: "#8B0000",
                            footer: {
                                text: "Requested by " + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                }

                if (msgs.first().content !== text) {
                    return message.channel.send({
                        embed: {
                            title: "Work Failed",
                            description: `You did not managed to get the right answer! The right answer was **${text}**, better luck next time!`,
                            color: "#8B0000",
                            footer: {
                                text: "Requested by " + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                }

                let Chances = Math.round(Math.random() * 3);
                let Message = ``;
                switch (Chances) {
                    case 1:
                        await db.add(`${message.author.id}_balance`, Reward);
                        await db.add(`${message.author.id}_balance`, Bonus);
                        Message = `You completed your job and managed to earn **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})** for the hour the boss was also happy with your work and gave you a bonus of **${Util.moneyFormat(Bonus)}**`;
                        break;
                    case 2:
                        await db.add(`${message.author.id}_balance`, Reward);
                        await db.add(`${message.author.id}_experience`, Bonus);
                        Message = `You completed your job and managed to earn **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})** for the hour the boss was also happy with your work and gave you a bonus of **${Util.moneyFormatW(Bonus)}** experience`;
                        break;
                    default:
                        await db.add(`${message.author.id}_balance`, Reward);
                        Message = `You completed your job and managed to earn **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**`;
                        break;
                }

                return message.channel.send({
                    embed: {
                        title: `Work Completed`,
                        description: Message,
                        color: "#008000",
                        footer: {
                            text: "Requested by " + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                });
                break;
            case 1:
                let ShownEmojis = Game.datajob["rememberemojis"];
                ShownEmojis = Util.shuffle(ShownEmojis);

                let TitleMessage1 = `Please memorize the words beside the emotes and the emtoes below this message\n\n`;
                for (let i = 0; i < 3; i++) {
                    TitleMessage1 += `${ShownEmojis[i]} - \`\`${Words[i]}\`\`\n`;
                }

                let OriginalMessage = await message.channel.send({
                    embed: {
                        title: `Work - ${Util.firstUpperCase(JobArray[UserJob])}`,
                        description: TitleMessage1,
                        color: "#8B0000",
                        footer: {
                            text: "Requested by " + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                });

                await Util.delay(5000);

                let RandomRange = Math.round(Math.random() * 2);
                await OriginalMessage.edit({
                    embed: {
                        title: `Work - ${Util.firstUpperCase(JobArray[UserJob])}`,
                        description: `What word appeared after ${ShownEmojis[RandomRange]}`,
                        color: "#8B0000",
                        footer: {
                            text: "Requested by " + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                });

                await message.channel.awaitMessages(response => (response.author.id == message.author.id), {
                    max: 1,
                    time: 60000,
                    errors: ['time'],
                }).then(async (collected) => {
                    let Message = collected.first().content.toLowerCase();
                    if (Message == Words[RandomRange]) {
                        let Chances = Math.round(Math.random() * 3);
                        let Message = ``;
                        switch (Chances) {
                            case 1:
                                await db.add(`${message.author.id}_balance`, Reward);
                                await db.add(`${message.author.id}_balance`, Bonus);
                                Message = `You completed your job and managed to earn **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})** for the hour the boss was also happy with your work and gave you a bonus of **${Util.moneyFormat(Bonus)}**`;
                                break;
                            case 2:
                                await db.add(`${message.author.id}_balance`, Reward);
                                await db.add(`${message.author.id}_experience`, Bonus);
                                Message = `You completed your job and managed to earn **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})** for the hour the boss was also happy with your work and gave you a bonus of **${Util.moneyFormatW(Bonus)}** experience`;
                                break;
                            default:
                                await db.add(`${message.author.id}_balance`, Reward);
                                Message = `You completed your job and managed to earn **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**`;
                                break;
                        }

                        return message.channel.send({
                            embed: {
                                title: `Work Completed`,
                                description: Message,
                                color: "#008000",
                                footer: {
                                    text: "Requested by " + message.author.tag,
                                    icon_url: message.author.displayAvatarURL()
                                },
                                timestamp: new Date()
                            }
                        });
                    }
                    else {
                        return message.channel.send({
                            embed: {
                                title: `Work Failed`,
                                description: `**Wrong**, Correct answer is **${Words[RandomRange]}**`,
                                color: "#8B0000",
                                footer: {
                                    text: "Requested by " + message.author.tag,
                                    icon_url: message.author.displayAvatarURL()
                                },
                                timestamp: new Date()
                            }
                        });
                    }

                }).catch((err) => {
                    return message.channel.send({
                        embed: {
                            title: `Work Failed`,
                            description: `Please make sure to solve the puzzle next time!`,
                            color: "#8B0000",
                            footer: {
                                text: "Requested by " + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                });

                break;
            default:
                let TitleMessage = `Please **unscramble any** of the given words which appear below this message\n\n`;
                for (let i = 0; i < Words.length; i++) {
                    TitleMessage += `\`\`${Util.shuffleWord(Words[i])}\`\` `;
                }

                await message.channel.send({
                    embed: {
                        title: `Work - ${Util.firstUpperCase(JobArray[UserJob])}`,
                        description: TitleMessage,
                        color: "#8B0000",
                        footer: {
                            text: "Requested by " + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                });

                await message.channel.awaitMessages(response => (response.author.id == message.author.id) && (Util.wordArray(Words, response.content)), {
                    max: 1,
                    time: 60000,
                    errors: ['time'],
                }).then(async (collected) => {
                    let Chances = Math.round(Math.random() * 3);
                    let Message = ``;
                    switch (Chances) {
                        case 1:
                            await db.add(`${message.author.id}_balance`, Reward);
                            await db.add(`${message.author.id}_balance`, Bonus);
                            Message = `You completed your job and managed to earn **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})** for the hour the boss was also happy with your work and gave you a bonus of **${Util.moneyFormat(Bonus)}**`;
                            break;
                        case 2:
                            await db.add(`${message.author.id}_balance`, Reward);
                            await db.add(`${message.author.id}_experience`, Bonus);
                            Message = `You completed your job and managed to earn **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})** for the hour the boss was also happy with your work and gave you a bonus of **${Util.moneyFormatW(Bonus)}** experience`;
                            break;
                        default:
                            await db.add(`${message.author.id}_balance`, Reward);
                            Message = `You completed your job and managed to earn **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**`;
                            break;
                    }

                    return message.channel.send({
                        embed: {
                            title: `Work Completed`,
                            description: Message,
                            color: "#008000",
                            footer: {
                                text: "Requested by " + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                }).catch((err) => {
                    return message.channel.send({
                        embed: {
                            title: `Work Failed`,
                            description: `Please make sure to solve the puzzle next time!`,
                            color: "#8B0000",
                            footer: {
                                text: "Requested by " + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                });
                break;
        }


    } catch (e) {
        console.error(e)
        message.reply("Something went wrong! Please try again later!")
    }
}

module.exports.minigames = MiniGames;