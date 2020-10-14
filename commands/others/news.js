const Util = require('../../util/MitUtil.js');
const NewsAPI = require('newsapi');
const config = require('../../config.json');
const Discord = require("discord.js");

module.exports = {
    name: 'news',
    description: "Gets the news using the headline provided",
    aliases: ['headline'],
    usage: ' [headline]',
    cooldown: 5,
    args: 1,
    catergory: 'Others',
    async execute(message, args, client) {
        try {
            const newsapi = new NewsAPI(config.newsapis);
            newsapi.v2.topHeadlines({
                q: args[0],
                language: 'en',
                country: 'us'
            }).then(response => {
                if (response.articles[0]) {
                    const NewsEmbed = new Discord.MessageEmbed()
                        .setColor('#8B0000')
                        .setTitle(response.articles[0].title)
                        .setURL(response.articles[0].url)
                        .setAuthor(response.articles[0].author)
                        .setDescription(response.articles[0].description)
                        .setThumbnail(response.articles[0].urlToImage)
                        .setTimestamp()
                        .setFooter(response.articles[0].source.name);

                    message.channel.send(NewsEmbed);
                }
                else {
                    message.channel.send("Nothing has been found");
                }
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
