const Util = require('../../util/MitUtil.js');
var request = require('request');

let subreddit = ["hmmm"];

module.exports = {
  name: 'confused',
  description: "Sends a random picture that makes you go HMMMMMM",
  aliases: ['hmmm'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Pictures',
  async execute(message, args, client) {
    try {
      Util.subredditimage(subreddit, message);
    } catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  }
};
