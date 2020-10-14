const Util = require('../../util/MitUtil.js');
const request = require("request");

let subreddit = ['bdsm', 'BDSMGW'];

module.exports = {
    name: 'bdsm',
    description: "Sends a random BDSM picture",
    aliases: ['dominatrix', 'domme'],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'NSFW',
    async execute(message, args, client) {
        if (message.channel.nsfw == true) {
            Util.subredditimage(subreddit, message);
        } else {
            message.reply("This isn't NSFW channel!")
        }
    }
};
