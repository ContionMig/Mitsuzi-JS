const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const Discord = require('discord.js');
const fs = require('fs');
const request = require('superagent');

module.exports = {
    name: 'trivia',
    description: "Starts a simple game of trivia",
    aliases: ["triv"],
    usage: ' [Easy, Medium, Hard]',
    cooldown: 30,
    args: 0,
    catergory: 'Economy',
    async execute(message, args, client) {
        try {
            let Luck = Util.NotNumberCheck(await db.get(`${message.author.id}_luck`));
            Luck += Util.NotNumberCheck(await db.get(`${message.author.id}_baseluck`));

            let MaxReword = 3000 - 500;
            let Difficulty = "medium";

            if (args[0]) {
                Difficulty = args[0].toLowerCase();
                if (Difficulty == "easy" || Difficulty == "e") {
                    Difficulty = "easy";
                    MaxReword = 2000 - 500;
                }
                else if (Difficulty == "medium" || Difficulty == "m") {
                    Difficulty = "medium";
                    MaxReword = 3000 - 500;
                }
                else if (Difficulty == "hard" || Difficulty == "h") {
                    Difficulty = "hard";
                    MaxReword = 5000 - 500;
                }
                else {
                    return message.reply("Please use a proper difficulty! Current settings are Easy, Medium, Hard, Extreme, Impossible!")
                }
            }

            await request.get(`https://opentdb.com/api.php?amount=1&difficulty=${Difficulty}&type=multiple`).then(res => {
                if (res.statusCode !== 200) return message.reply("Oh no, an error occurred. Try again later!");
                let WholeQuestions = JSON.parse(res.text);
                WholeQuestions = WholeQuestions["results"][0];

                let WrongAnswers = WholeQuestions["incorrect_answers"];
                let RightAnswer = WholeQuestions["correct_answer"];
                RightAnswer = Util.escapeHTML(RightAnswer);

                WrongAnswers.push(RightAnswer);
                WrongAnswers = Util.shuffle(WrongAnswers);

                let Message = `**Question:**\n${WholeQuestions["question"]}\n\n`
                for (let i = 0; i < WrongAnswers.length; i++) {
                    WrongAnswers[i] = Util.escapeHTML(WrongAnswers[i]);
                    Message += `\`\`${(i + 1)})\`\` ${WrongAnswers[i]}\n`;
                }
                Message += `\nYou have **10 seconds** to answer the question!`;
                Message = Util.escapeHTML(Message);

                return message.channel.send({
                    embed: {
                        title: WholeQuestions["category"],
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
                        let Reward = Math.round(Math.random() * MaxReword) + 500;

                        if (Luck > 0) {
                            Luck = (Reward / 100) * Luck;
                        }

                        Reward += Luck;
                        if (isNaN(collected.first().content)) {
                            if (collected.first().content.toLowerCase() == RightAnswer) {
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
                        else {
                            let Answer = Util.NotNumberCheck(collected.first().content);
                            Answer -= 1;

                            if (Answer < 0 || Answer > WrongAnswers.length) {
                                return message.channel.send({
                                    embed: {
                                        title: "Wrong Answer",
                                        description: `The right answer is **${RightAnswer}**, better luck next time!`,
                                        color: "#8B0000",
                                        footer: {
                                            text: "Requested by " + message.author.tag,
                                            icon_url: message.author.displayAvatarURL()
                                        },
                                        timestamp: new Date()
                                    }
                                });
                            }
                            
                            if (WrongAnswers[Answer] == RightAnswer) {
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
                                description: `The right answer is **${RightAnswer}**, better luck next time!`,
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
            })
        }
        catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
