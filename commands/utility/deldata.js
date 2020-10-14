const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const { ownerid } = require('../../config.json');
const fs = require('fs');

module.exports = {
    name: 'deldata',
    description: "[OWNER] Delete the database key",
    aliases: ['datadel', 'dbdel', 'dbdelete'],
    usage: '',
    cooldown: 2,
    args: -1,
    catergory: 'Utility',
    hidden: true,
    async execute(message, args, client) {
        try {
            if (message.author.id !== ownerid) return;

            await db.del(args[0]);
            return message.channel.send({
                embed: {
                    title: "[Owner] Deleted Database key",
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
