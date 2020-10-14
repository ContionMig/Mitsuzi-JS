const Util = require('../../util/MitUtil.js');
const request = require("request");

let subreddit = ["rule34"];

module.exports = {
    name: 'rule34',
    description: "Sends a random rule34 picture",
    aliases: ['cartoon'],
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
