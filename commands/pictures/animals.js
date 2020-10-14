const Util = require('../../util/MitUtil.js');
var request = require('request');

subreddit = ["Eyebleach"];

module.exports = {
  name: 'animal',
  description: "Sends a random animal",
  aliases: ['animals', 'wildlife'],
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
