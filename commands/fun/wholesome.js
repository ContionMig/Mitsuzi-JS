const Util = require('../../util/MitUtil.js');
const request = require("request");

let subreddit = ["wholesomememes"];

module.exports = {
  name: 'wholesome',
  description: "Sends a random wholesome memes found on reddit",
  aliases: ['wholesomememes'],
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
