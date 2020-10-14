const Util = require('../../util/MitUtil.js');
var request = require('request');

let subreddit = ["streetwear"];

module.exports = {
  name: 'fashion',
  description: "Sends a random picture related to fashion",
  aliases: ['fashions', 'beauty'],
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
