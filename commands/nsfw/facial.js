const Util = require('../../util/MitUtil.js');
const request = require("request");

let subreddit = ["FacialFun"];

module.exports = {
    name: 'facial',
    description: "Sends a random facial picture",
    aliases: ['facialfun', 'cumface'],
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
