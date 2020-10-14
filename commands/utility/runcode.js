const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const { ownerid } = require('../../config.json');
const { inspect } = require('util');
const fs = require('fs');

module.exports = {
    name: 'runcode',
    description: "[OWNER] Runs NodeJS code on the go",
    aliases: [],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'Utility',
    hidden: true,
    async execute(message, args, client) {
        try {
            if (message.author.id !== ownerid) return;

            let evaled = await eval(args.join(' '));
            return message.channel.send({
                embed: {
                    title: "Code Evaluation",
                    description: `\`\`\`${inspect(evaled)}\`\`\``,
                    color: "#8B0000",
                    footer: {
                        text: "Requested by " + message.author.tag,
                        icon_url: message.author.displayAvatarURL()
                    },
                    timestamp: new Date()
                }
            });
        } catch (e) {
            console.error(e)
        }
    }
};
