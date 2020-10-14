const Util = require('../../util/MitUtil.js');
const request = require("request");

let subreddit = [
    'cat_girls',
    'fursuitsex',
    'sexybunnies',
    'furryfemdom'
];

module.exports = {
    name: 'furry',
    description: "Sends a random furry images",
    aliases: ['furries'],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'NSFW',
    async execute(message, args, client) {
        try {
            Util.subredditimage(subreddit, message);
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
