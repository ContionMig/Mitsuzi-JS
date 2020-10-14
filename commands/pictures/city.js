const Util = require('../../util/MitUtil.js');
var randomCat = require('random-cat');
const request = require("request");

let subreddit = ['CityPorn'];

module.exports = {
  name: 'city',
  description: "Sends a random picture of a city",
  aliases: ['cities'],
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
