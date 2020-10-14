const Util = require('../../util/MitUtil.js');

module.exports = {
    name: 'historytoday',
    description: "Gets any historic event that happened today",
    aliases: ['history', 'today'],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'Others',
    async execute(message, args, client) {
        try {
            let today = new Date();
            let theDate = today.getDate();
            let theMonth = today.getMonth();
            const date = theMonth && theDate ? `/${theMonth}/${theDate}` : '';
            try {
                const SuperRequest = require('node-superfetch');
                const { text } = await SuperRequest.get(`http://history.muffinlabs.com/date${date}`);
                const body = JSON.parse(text);
                const events = body.data.Events;
                const event = events[Math.floor(Math.random() * events.length)];
                message.channel.send({
                    embed: {
                        title: `On this day (${body.date})...`,
                        color: "#8B0000",
                        url: body.url,
                        description: `${event.year}: ${event.text}`,
                        timestamp: new Date(),
                        footer: {
                            text: "Requested by " + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                        },
                    }
                });

            } catch (err) {
                if (err.status === 404 || err.status === 500) return message.channel.send('Unknown error, invalid date.');
            }
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
