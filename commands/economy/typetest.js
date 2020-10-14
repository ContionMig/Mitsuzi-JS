const Util = require('../../util/MitUtil.js');
var randomnumber = require('random-number');
const Discord = require('discord.js');
const Canvas = require('canvas');
const db = require('../../util/Database.js');
const { splitMessage } = require("discord.js");
var stringSimilarity = require('string-similarity');
const fs = require('fs');
var randomWords = require('random-words');

let rawdata = fs.readFileSync('./include/assets/json/typetest.json');
let Game = JSON.parse(rawdata);

module.exports = {
    name: 'typetest',
    description: "Gives the user a sentence to type out",
    aliases: ['type'],
    usage: ' [Easy, Medium, Hard, Extreme, Impossible]',
    cooldown: 30,
    args: 1,
    catergory: 'Economy',
    async execute(message, args, client) {
        try {
            let sentences = Game["sentences"];
            let Difficulty = args[0].toLowerCase();
            let IntDifficulty = 1;
            let TimeForTest = 5000;

            if (Difficulty === "easy" || Difficulty === "e") {
                IntDifficulty = 1;
                TimeForTest = 20000;
            }
            else if (Difficulty === "medium" || Difficulty === "m") {
                IntDifficulty = 2;
                TimeForTest = 17000;
            }
            else if (Difficulty === "hard" || Difficulty === "h") {
                IntDifficulty = 3;
                TimeForTest = 14000;
            }
            else if (Difficulty === "extreme" || Difficulty === "ex") {
                IntDifficulty = 4;
                TimeForTest = 8000;
            }
            else if (Difficulty === "impossible" || Difficulty === "i") {
                IntDifficulty = 5;
                TimeForTest = 6000;
            }
            else {
                return message.reply("Please use a proper difficulty! Current settings are Easy, Medium, Hard, Extreme, Impossible!")
            }

            let Reward = IntDifficulty * 1000;
            var options = { min: 5, max: Reward, integer: true }
            Reward = randomnumber(options);

            let sentence = sentences[Math.floor(Math.random() * sentences.length)];
            sentence = randomWords({ exactly: 13, join: ' ' });

            const canvas = Canvas.createCanvas(700, 70);
            const ctx = canvas.getContext('2d');

            const background = await Canvas.loadImage('./img/grey-background.jpg');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = '#74037b';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            ctx.font = Util.applyText(canvas, sentence, 50);
            ctx.fillStyle = '#ffffff';

            let duptext = sentence;
            const splittext = splitMessage(duptext, {
                maxLength: 50,
                char: " ",
                prepend: "",
                append: ""
            });

            duptext = "";
            splittext.forEach(async (m) => {
                duptext += m + "\n";
            });

            ctx.fillText(duptext, 15, 25);

            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'background.png');

            await message.reply(`**You have ${TimeForTest / 1000} seconds to type this sentence.**`, attachment);

            const now = Date.now();
            const messages = await message.channel.awaitMessages(res => res.author.id === message.author.id, {
                max: 1,
                TimeForTest
            });

            var similarity = stringSimilarity.compareTwoStrings(messages.first().content, sentence);
            if (!messages.size || similarity < 0.9 || ((Date.now() - now) / 1000) > (TimeForTest / 1000)) return message.reply('Sorry! You lost! Try again next time');

            let Luck = Util.NotNumberCheck(await db.get(`${message.author.id}_luck`));
            Luck += Util.NotNumberCheck(await db.get(`${message.author.id}_baseluck`));

            if (Luck > 0) {
                Luck = (Reward / 100) * Luck;
            }

            Reward += Luck;

            db.add(`${message.author.id}_balance`, Reward);
            let Message = `You Won:\n**${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**\n\n( Took ${(Date.now() - now) / 1000} seconds )`;
            return message.channel.send({
                embed: {
                    title: "Nice job!",
                    description: Message,
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
