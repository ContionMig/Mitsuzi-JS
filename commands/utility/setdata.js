const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const { ownerid } = require('../../config.json');
const fs = require('fs');

module.exports = {
    name: 'setdata',
    description: "[OWNER] Sets the database value",
    aliases: ['dataset', 'dbset', 'setdb'],
    usage: '',
    cooldown: 2,
    args: -1,
    catergory: 'Utility',
    hidden: true,
    async execute(message, args, client) {
        try {
            if (message.author.id !== ownerid) return;

            let Value = await db.get(args[0]);
            await db.set(args[0], args[1]);

            return message.channel.send({
                embed: {
                    title: "[Owner] Set Database",
                    description: `**Previous:** ${Value}\n**Set:** ${args[1]}`,
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
