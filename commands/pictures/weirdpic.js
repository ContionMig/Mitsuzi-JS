const Util = require('../../util/MitUtil.js');
var request = require('request');

let subreddit = ["TreesSuckingOnThings", "birdswitharms", "peoplewithbirdheads", "chairsunderwater", "boottoobig", "BreadStapledToTrees"];

module.exports = {
  name: 'weirdpic',
  description: "Sends a random picture that makes you go WTF",
  aliases: ['weird', 'wtf'],
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
