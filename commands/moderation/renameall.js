const Util = require('../../util/MitUtil.js');
const url = require('url');

module.exports = {
    name: 'renameall',
    description: "Renames all users in the server to the name provided",
    aliases: [],
    usage: ' [name]',
    cooldown: 30,
    args: 0,
    catergory: 'Moderation',
    async execute(message, args, client) {
        try {
            let TotalErrors = 0;
            if (!message.member.hasPermission('ADMINISTRATOR')) {
                return message.reply("Please make sure you have admin perms!")
            }

            if (args.length > 0) {
                let nickname = args.join(" ");
                
                message.reply(`Renaming ${message.guild.memberCount} users, it may take awhile!`)
                for (const member of message.guild.members.cache.values()) {
                    try {
                        await member.setNickname(nickname);
                    } catch {
                        TotalErrors++;
                        continue;
                    }
                }

                return message.reply(`Successfully renamed all but ${TotalErrors} member(s) to **${nickname}**!`);
            }
            else {
                message.reply(`Renaming ${message.guild.memberCount} users, it may take awhile!`)
                for (const member of message.guild.members.cache.values()) {
                    try {
                        await member.setNickname("");
                    } catch {
                        TotalErrors++;
                        continue;
                    }
                }
                return message.reply(`Successfully renamed all but ${TotalErrors} member(s) to their orignal nickname!`);
            }
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
