const Util = require('../../util/MitUtil.js');
var request = require('request');

let subreddit = ["RoomPorn"]

module.exports = {
  name: 'rooms',
  description: "Sends a random picture of a room",
  aliases: ['roompic'],
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
