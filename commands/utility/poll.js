const Util = require('../../util/MitUtil.js');
const Discord = require("discord.js");
const db = require('../../util/Database.js');

let EmoteVoteArray = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

module.exports = {
    name: 'poll',
    description: 'Returns the help list and all commands',
    aliases: ['vote'],
    usage: ' [title],[option1],[option2]...',
    cooldown: 2,
    args: -1,
    catergory: 'Utility',
    async execute(message, args, client) {
        try {
            let TotalPoll = args.join(" ");
            let Splits = TotalPoll.split(",");

            let Message = '';
            if (Splits.length < 2) {
                Message = `**${TotalPoll}**\n\n`;
                Message += `${EmoteVoteArray[0]} Yes\n`;
                Message += `${EmoteVoteArray[1]} No\nPlease make a vote by reacting to the reactions/emotes below!`;

                return message.channel.send(Message).then(function (message) {
                    for (let i = 0; i < 2; i++) {
                        message.react(EmoteVoteArray[i]);
                    }
                });
            }
            else if (Splits.length < 10) {
                Message = `**${Splits[0]}**\n\n`;
                for (let i = 1; i < Splits.length; i++) {
                    Message += `${EmoteVoteArray[i - 1]} ${Splits[i]}\n`;
                }
                Message += `\nPlease make a vote by reacting to the reactions/emotes below!`;

                return message.channel.send(Message).then(function (message) {
                    for (let i = 0; i < (Splits.length - 1); i++) {
                        message.react(EmoteVoteArray[i]);
                    }
                });
            }
            else {
                return message.reply("Please use the command in the right way!\nUsage: ``+poll What is your favourite colour?,Red,Green,Yellow``\nOptions Range: ``1 - 9``")
            }
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
