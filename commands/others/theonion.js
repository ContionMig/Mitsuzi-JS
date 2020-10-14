const Util = require('../../util/MitUtil.js');
const RSS = require('rss-parser');
const { stripIndents } = require('common-tags');

module.exports = {
    name: 'theonion',
    description: `Responds with a random "The Onion" article.`,
    aliases: ['onion'],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'Others',
    async execute(message, args, client) {
        const parser = new RSS();
		try {
			const feed = await parser.parseURL('https://www.theonion.com/rss');
			const article = feed.items[Math.floor(Math.random() * feed.items.length)];
			return message.channel.send({
                embed: {
                    title: "The Onion Machine",
                    description: article.title,
                    url: article.link,
                    color: "#8B0000",
                    footer: {
                        text: "Requested by " + message.author.tag,
                        icon_url: message.author.displayAvatarURL()
                    },
                    timestamp: new Date()
                }
            });
		} catch (err) {
			console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
		}
    }
};
