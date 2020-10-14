const Util = require('../../util/MitUtil.js');
const request = require('node-superfetch');
const url = require('url');


module.exports = {
	name: 'capturewebsite',
	description: "Return a screenshot of the website",
	aliases: ['website', 'webss', 'web', 'capture'],
	usage: ' [url]',
	cooldown: 3,
	args: 1,
	catergory: 'Utility',
	pornList: [],
	async execute(message, args, client) {
		try {
			if (message.channel.nsfw == true) {
				let site = args[0];
				try {
					if (!this.pornList) await this.fetchPornList();
					const parsed = url.parse(site);
					if (this.pornList.some(pornURL => parsed.host === pornURL) && !message.channel.nsfw) {
						return message.reply('This site is NSFW.');
					}
					const { body } = await request.get(`https://image.thum.io/get/width/1920/crop/675/noanimate/${site}`);
					return message.channel.send({ files: [{ attachment: body, name: 'screenshot.png' }] });
				} catch (err) {
					if (err.status === 404) return message.channel.send('Could not find any results. Invalid URL?');
					console.log(err);
					return message.reply(`Oh no, an error occurred. Try again later!`);
				}
			} else {
				message.reply("This isn't NSFW channel!")
			}
		} catch (err) {
			console.log(err);
			return message.reply(`Oh no, an error occurred. Try again later!`);
		}
	},
	async fetchPornList(force = false) {
		if (!force && this.pornList) return this.pornList;
		const { text } = await request.get('https://raw.githubusercontent.com/blocklistproject/Lists/master/porn.txt');
		this.pornList = text.split('\n')
			.filter(site => site && !site.startsWith('#'))
			.map(site => site.replace(/^(0.0.0.0	)/, '')); // eslint-disable-line no-control-regex
		return this.pornList;
	}
};
