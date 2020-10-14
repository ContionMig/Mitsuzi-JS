const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const { ownerid } = require('../../config.json');
const fs = require('fs');

module.exports = {
    name: 'getdata',
    description: "[OWNER] Gets the database value",
    aliases: ['dataget', 'dbget', 'getdb'],
    usage: '',
    cooldown: 2,
    args: -1,
    catergory: 'Utility',
    hidden: true,
    async execute(message, args, client) {
        try {
            if (message.author.id !== ownerid) return;

            let Value = await db.get(args[0]);

            return message.channel.send({
                embed: {
                    title: "[Owner] Get Database",
                    description: `**Value:** ${Value}`,
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
