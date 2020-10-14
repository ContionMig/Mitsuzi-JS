const Util = require('../../util/MitUtil.js');
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'rottentomatoes',
    description: "Searches Rotten Tomatoes for your query.",
    aliases: ['w', 'rotten'],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'Others',
    async execute(message, args, client) {
        let SearchTerm = args.join(" ");
        try {
			const id = await this.search(SearchTerm);
			if (!id) return msg.say('Could not find any results.');
			const data = await this.fetchMovie(id);
			const criticScore = data.ratingSummary.allCritics;
			const audienceScore = data.ratingSummary.audience;
			const embed = new MessageEmbed()
				.setColor("#8B0000")
				.setTitle(`${data.title} (${data.year})`)
				.setURL(`https://www.rottentomatoes.com${data.url}`)
				.setAuthor('Rotten Tomatoes', 'https://i.imgur.com/Sru8mZ3.jpg', 'https://www.rottentomatoes.com/')
				.setDescription(Util.shorten(data.ratingSummary.consensus))
				.setThumbnail(data.posters.original)
				.addField('• Critic Score', criticScore.meterValue ? `${criticScore.meterValue}%` : '???', true)
                .addField('• Audience Score', audienceScore.meterScore ? `${audienceScore.meterScore}%` : '???', true)
                .setFooter("Requested by " + message.author.tag);

			return message.channel.send(embed);
		} catch (err) {
			console.log(err);
      		return message.reply(`Oh no, an error occurred. Try again later!`);
		}
    },
    async search(query) {
		const { body } = await request
			.get('https://www.rottentomatoes.com/api/private/v2.0/search/')
			.query({
				limit: 10,
				q: query
			});
		if (!body.movies.length) return null;
		const find = body.movies.find(m => m.name.toLowerCase() === query.toLowerCase()) || body.movies[0];
		return find.url.replace('/m/', '');
	},
	async fetchMovie(id) {
		const { text } = await request.get(`https://www.rottentomatoes.com/api/private/v1.0/movies/${id}`);
		return JSON.parse(text);
	}
};
