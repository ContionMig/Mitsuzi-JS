const Util = require('../../util/MitUtil.js');
const request = require("request");

let subreddit = ["memes", "dankmemes"];

module.exports = {
  name: 'meme',
  description: "Sends a random meme found on reddit",
  aliases: ['memes'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Fun',
  async execute(message, args, client) {
    try {
      Util.subredditimage(subreddit, message);
    } catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  }
};
