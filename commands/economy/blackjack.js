const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const fs = require('fs');
const Discord = require('discord.js');

let rawdata = fs.readFileSync('./include/assets/json/game.json');
let Game = JSON.parse(rawdata);

let BlackjackEmotes = Game.data["blackjackemotes"];
let Blackjack = Game.data["blackjack"];

let Hit = ["hit", "h", "more", "yes"];
const cooldowns = new Discord.Collection();

module.exports = {
    name: 'blackjack',
    description: "starts a game of blackjack",
    aliases: ['bj'],
    usage: ' [bet]',
    cooldown: 20,
    args: 1,
    catergory: 'Economy',
    async execute(message, args, client) {
        try {
            var now = Date.now();
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

            if (cooldowns.has(message.author.id)) {
                return message.reply("Please finish your current game of blackjack!")
            }
            cooldowns.set(message.author.id, now);

            let BigArray = this.randStart();

            let UserHands = BigArray[0];
            let ShowEmotesUser = BigArray[1];

            let DealerHands = BigArray[2];
            let ShowEmotesDealer = BigArray[3];

            let HiddenCard = BigArray[4];

            let UserTotal = this.arrCardCalc(UserHands);
            let DealerTotal = this.arrCardCalc(DealerHands);

            let Reward = Util.getRandomInt(Math.floor(Amount / 4), (Amount * 2));
            let Luck = Util.NotNumberCheck(await db.get(`${message.author.id}_luck`));
            Luck += Util.NotNumberCheck(await db.get(`${message.author.id}_baseluck`));

            if (Luck > 0) {
                Luck = (Reward / 100) * Luck;
            }

            Reward += Luck;

            if (UserTotal > 21) {
                db.subtract(`${message.author.id}_balance`, Amount);
                cooldowns.delete(message.author.id);
                return message.channel.send({
                    embed: {
                        title: "BackJack **( You Lost! )**",
                        description: `You have lost **${Util.moneyFormat(Amount)}**`,
                        fields: [{
                            name: `${message.author.username} **[${UserTotal}]**`,
                            value: `${ShowEmotesUser}`,
                            inline: true,
                        },
                        {
                            name: `${client.user.username} **[${DealerTotal} + ??]**`,
                            value: `${ShowEmotesDealer}`,
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
            }
            else if (UserTotal == 21) {
                db.add(`${message.author.id}_balance`, Reward);
                cooldowns.delete(message.author.id);
                return message.channel.send({
                    embed: {
                        title: "BackJack **( You Won! )**",
                        description: `You have won **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**`,
                        fields: [{
                            name: `${message.author.username} **[${UserTotal}]**`,
                            value: `${ShowEmotesUser}`,
                            inline: true,
                        },
                        {
                            name: `${client.user.username} **[${DealerTotal}]**`,
                            value: `${ShowEmotesDealer}`,
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
            }

            let Ended = false;
            while (!Ended) {
                await message.channel.send({
                    embed: {
                        title: "BlackJack",
                        description: "Reply with \`hit\` or \`stand\` to continue the game",
                        fields: [{
                            name: `${message.author.username} **[${UserTotal}]**`,
                            value: `${ShowEmotesUser}`,
                            inline: true,
                        },
                        {
                            name: `${client.user.username} **[${DealerTotal} + ?]**`,
                            value: `${ShowEmotesDealer}`,
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

                await message.channel.awaitMessages(response => (response.author.id == message.author.id), {
                    max: 1,
                    time: 60000,
                    errors: ['time'],
                }).then((collected) => {

                    let hit = false;
                    if (isNaN(collected.first().content)) {
                        if ((Hit.indexOf(collected.first().content.toLowerCase())) > -1) {
                            hit = true;
                        }
                    }

                    if (hit) {
                        let Random = Math.floor(Math.random() * Blackjack.length);
                        UserHands.push(Blackjack[Random]);
                        ShowEmotesUser += BlackjackEmotes[Random];
                        UserTotal = this.arrCardCalc(UserHands);

                        if (UserTotal > 21) {
                            Ended = true;
                            db.subtract(`${message.author.id}_balance`, Amount);
                            cooldowns.delete(message.author.id);
                            return message.channel.send({
                                embed: {
                                    title: "BackJack **( You Lost! )**",
                                    description: `You have lost **${Util.moneyFormat(Amount)}**`,
                                    fields: [{
                                        name: `${message.author.username} **[${UserTotal}]**`,
                                        value: `${ShowEmotesUser}`,
                                        inline: true,
                                    },
                                    {
                                        name: `${client.user.username} **[${DealerTotal} + ?]**`,
                                        value: `${ShowEmotesDealer}`,
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
                        }
                        else if (UserTotal == 21) {
                            Ended = true;
                            db.add(`${message.author.id}_balance`, Reward);
                            cooldowns.delete(message.author.id);
                            return message.channel.send({
                                embed: {
                                    title: "BackJack **( You Won! )**",
                                    description: `You have won **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**`,
                                    fields: [{
                                        name: `${message.author.username} **[${UserTotal}]**`,
                                        value: `${ShowEmotesUser}`,
                                        inline: true,
                                    },
                                    {
                                        name: `${client.user.username} **[${DealerTotal}]**`,
                                        value: `${ShowEmotesDealer}`,
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
                        }
                    }
                    else {
                        DealerHands.push(Blackjack[HiddenCard]);
                        ShowEmotesDealer = ShowEmotesDealer.replace("🎴", BlackjackEmotes[HiddenCard]);
                        DealerTotal = this.arrCardCalc(DealerHands);

                        let Loop = 0;
                        while (DealerTotal < 17) {
                            if (Loop > 3) {
                                break;
                            }

                            let Random = Math.floor(Math.random() * Blackjack.length);
                            DealerHands.push(Blackjack[Random]);
                            ShowEmotesDealer += BlackjackEmotes[Random];
                            DealerTotal = this.arrCardCalc(DealerHands);
                            Loop++;
                        }

                        if (DealerTotal > 21) {
                            Ended = true;
                            db.add(`${message.author.id}_balance`, Reward);
                            cooldowns.delete(message.author.id);
                            return message.channel.send({
                                embed: {
                                    title: "BackJack **( You Won! )**",
                                    description: `You have won **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**`,
                                    fields: [{
                                        name: `${message.author.username} **[${UserTotal}]**`,
                                        value: `${ShowEmotesUser}`,
                                        inline: true,
                                    },
                                    {
                                        name: `${client.user.username} **[${DealerTotal}]**`,
                                        value: `${ShowEmotesDealer}`,
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
                        }

                        if (UserTotal > DealerTotal) {
                            Ended = true;
                            db.add(`${message.author.id}_balance`, Reward);
                            cooldowns.delete(message.author.id);
                            return message.channel.send({
                                embed: {
                                    title: "BackJack **( You Won! )**",
                                    description: `You have won **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**`,
                                    fields: [{
                                        name: `${message.author.username} **[${UserTotal}]**`,
                                        value: `${ShowEmotesUser}`,
                                        inline: true,
                                    },
                                    {
                                        name: `${client.user.username} **[${DealerTotal}]**`,
                                        value: `${ShowEmotesDealer}`,
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
                        }
                        else if (UserTotal == DealerTotal) {
                            Ended = true;
                            cooldowns.delete(message.author.id);
                            return message.channel.send({
                                embed: {
                                    title: "BackJack **( You Tied! )**",
                                    description: `You both tied, so you didn't win or lose`,
                                    fields: [{
                                        name: `${message.author.username} **[${UserTotal}]**`,
                                        value: `${ShowEmotesUser}`,
                                        inline: true,
                                    },
                                    {
                                        name: `${client.user.username} **[${DealerTotal}]**`,
                                        value: `${ShowEmotesDealer}`,
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
                        }
                        else {
                            Ended = true;
                            db.subtract(`${message.author.id}_balance`, Amount);
                            cooldowns.delete(message.author.id);
                            return message.channel.send({
                                embed: {
                                    title: "BackJack **( You Lost! )**",
                                    description: `You have lost **${Util.moneyFormat(Amount)}**`,
                                    fields: [{
                                        name: `${message.author.username} **[${UserTotal}]**`,
                                        value: `${ShowEmotesUser}`,
                                        inline: true,
                                    },
                                    {
                                        name: `${client.user.username} **[${DealerTotal}]**`,
                                        value: `${ShowEmotesDealer}`,
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
                        }
                    }

                }).catch((err) => {
                    console.log(err);
                    Ended = true;
                    db.subtract(`${message.author.id}_balance`, Amount);
                    cooldowns.delete(message.author.id);
                    return message.reply('Time ran out! Please choose next time! Bet has also been deducted!');
                });
            }
        }
        catch (err) {
            console.log(err);
            cooldowns.delete(message.author.id);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    },
    randStart() {
        let UserHands = [];
        let ShowEmotesUser = "";

        let DealerHands = [];
        let ShowEmotesDealer = "";

        for (let i = 0; i < 2; i++) {
            let Random = Math.floor(Math.random() * Blackjack.length);
            UserHands.push(Blackjack[Random]);
            ShowEmotesUser += BlackjackEmotes[Random];
        }

        let Random = Math.floor(Math.random() * Blackjack.length);
        DealerHands.push(Blackjack[Random]);
        ShowEmotesDealer += BlackjackEmotes[Random];

        Random = Math.floor(Math.random() * Blackjack.length);
        HiddenCard = Random;
        ShowEmotesDealer += "🎴";
        return [UserHands, ShowEmotesUser, DealerHands, ShowEmotesDealer, HiddenCard];
    },
    ToInteger(card) {
        if (card == "A") {
            return 11;
        }
        else if (card == "base") {
            return 0;
        }
        else if (card == "J" || card == "Q" || card == "K") {
            return 10;
        }
        else {
            return Number(card);
        }
    },
    aceCheck(value, total) {
        if (total + value > 21 && value == 11) {
            return 1;
        }
        else {
            return value;
        }
    },
    arrCardCalc(arr) {
        var sum = 0;

        let Ace = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == "A") {
                Ace += 1;
            }
            sum += this.ToInteger(arr[i]);
        }

        while (sum > 21) {
            if (Ace > 0) {
                sum -= 10;
                Ace -= 1;
            }
            else {
                break;
            }
        }

        return sum;
    }

};
