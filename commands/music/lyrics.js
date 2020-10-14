const Util = require('../../util/MitUtil.js');
var config = require("../../config.json");

const lyricsFinderN = require("lyrics-finder");
const { MessageEmbed, splitMessage } = require("discord.js");

const lyricsFinder = require("genius-lyrics-api");
var api = require('genius-api');
var GeniusLyrics = require('genius-lyrics-api');

var genius = new api(config.geniusapikey);

module.exports = {
  name: 'lyrics',
  description: "Tries to find the lyrics of the song provided",
  aliases: ['lyric', 'song'],
  usage: ' [songtitle]',
  cooldown: 2,
  args: 0,
  catergory: 'Music',
  async execute(message, args, client) {
    try {
      const queue = message.client.queue.get(message.guild.id);
      let SongTitle = "";
      if (args.length > 0) {
        SongTitle = args.join(" ");
      }
      else if (queue) {
        SongTitle = queue.songs[0].title;
      }
      else {
        return message.channel.send("There is nothing playing.").catch(console.error);
      }

      let lyrics = null;

      try {
        lyrics = await lyricsFinderN(SongTitle, "");
        if (!lyrics) lyrics = `No lyrics found for ${SongTitle}.`;
      } catch (error) {
        lyrics = `No lyrics found for ${SongTitle}.`;
      }

      let lyricsEmbed = new MessageEmbed()
        .setTitle("Lyrics")
        .setDescription(lyrics)
        .setColor("#8B0000")
        .setTimestamp();


      const splitDescription = splitMessage(lyrics, {
        maxLength: 2048,
        char: "\n",
        prepend: "",
        append: ""
      });

      splitDescription.forEach(async (m) => {
        lyricsEmbed.setDescription(m);
        await message.channel.send(lyricsEmbed);
      });
    } catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  }
};
