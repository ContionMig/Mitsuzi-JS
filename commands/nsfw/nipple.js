const Util = require('../../util/MitUtil.js');
const request = require("request");

let subreddit = [
    'Nipples',
    'Puffies',
    'areolas',
    'SmallNipples',
    'bigareolas'
];

module.exports = {
    name: 'nipple',
    description: "Sends a random picture of nipples",
    aliases: ['nipples', 'nip', 'nips'],
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
