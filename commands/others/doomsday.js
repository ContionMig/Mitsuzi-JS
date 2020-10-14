const Util = require('../../util/MitUtil.js');
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'doomsday',
    description: `Responds with the current time of the Doomsday Clock.`,
    aliases: ['doomsdayclock'],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'Others',
    async execute(message, args, client) {
        try {
            const { text } = await request.get('https://thebulletin.org/doomsday-clock/past-announcements/');
            const time = text.match(/<h3 class="uabb-infobox-title">(.+)<\/h3>/)[1];
            const year = text.match(/<h5 class="uabb-infobox-title-prefix">(.+)<\/h5>/)[1];
            const description = text.match(/<div class="uabb-infobox-text uabb-text-editor">.+<p>(.+)<\/p>/)[1]
                .replace(/<a href="(.+)" target="_blank" rel="noopener">(.+)<\/a>/, Util.embedURL('$2', '$1'))
                .replace(/<em>(.+)<\/em>/i, '_$1_');

            const embed = new MessageEmbed()
                .setTitle(`${year}: ${time}`)
                .setColor("#8B0000")
                .setURL('https://thebulletin.org/doomsday-clock/current-time/')
                .setDescription(description)
                .setFooter("Requested by " + message.author.tag);

            return message.channel.send(embed);
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
