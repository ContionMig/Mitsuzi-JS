const Util = require('../../util/MitUtil.js');
const request = require("request");

let subreddit = [
    'Pee',
    'watersports',
    'cuckoldcaptions',
    'wetfetish',
    'GayWatersports',
    'AsianPee'
];

module.exports = {
    name: 'watersports',
    description: "Sends a random pictures of people peeing",
    aliases: ['watersport', 'pee'],
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
