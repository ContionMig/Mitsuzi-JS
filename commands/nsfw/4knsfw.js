const Util = require('../../util/MitUtil.js');
const superagent = require('superagent');

module.exports = {
    name: '4knsfw',
    description: "Sends a random nsfw image",
    aliases: ['nsfw'],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'NSFW',
    async execute(message, args, client) {
        try {
            if (message.channel.nsfw == true) {
                Util.subredditimage(['hentai', 'nsfw'], message);
            } else {
                message.reply("This isn't NSFW channel!")
            }
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
