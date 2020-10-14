const Util = require('../../util/MitUtil.js');
const request = require("request");

let subreddit = ["girlsinyogapants"];

module.exports = {
    name: 'yogagirl',
    description: "Sends a random picture of a women in yoga pants",
    aliases: ['yogapants', 'yoga'],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'NSFW',
    async execute(message, args, client) {
        try {
            if (message.channel.nsfw == true) {
                Util.subredditimage(subreddit, message);
            } else {
                message.reply("This isn't NSFW channel!")
            }
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
