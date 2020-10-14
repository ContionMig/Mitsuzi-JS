const Util = require('../../util/MitUtil.js');
var request = require('request');

let subreddit = ["Cringetopia"];

module.exports = {
  name: 'cringe',
  description: "Sends a random cringe worthy picture",
  aliases: ['cringetopia', 'quiver'],
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
