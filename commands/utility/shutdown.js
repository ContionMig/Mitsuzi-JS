const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const config = require('../../config.json');

module.exports = {
    name: 'shutdown',
    description: "[OWNER] Shuts down the bot",
    aliases: ['exit'],
    usage: ' ',
    cooldown: 2,
    args: 0,
    catergory: 'Utility',
    hidden: true,
    async execute(message, args, client) {
        if (message.author.id !== config.ownerid) return;

        try {
            await message.reply('[SHUTDOWN] Manual shutdown engaged.');
            process.exit(0);
        } catch {
            process.exit(0);
        }
    }
};
