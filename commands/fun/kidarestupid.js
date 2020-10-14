const Util = require('../../util/MitUtil.js');
const request = require("request");

let subreddit = ["youngpeopleyoutube"];

module.exports = {
  name: 'kidsarestupid',
  description: "Sends a random KidsAreStupid found on reddit",
  aliases: ["youngpeopleyoutube"],
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
