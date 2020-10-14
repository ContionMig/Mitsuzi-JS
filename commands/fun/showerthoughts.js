const Util = require('../../util/MitUtil.js');
const request = require("request");

module.exports = {
    name: 'showerthought',
    description: "Replies with a random shower thought",
    aliases: ['showerthoughts', "mindblown", "mindfuck"],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'Fun',
    async execute(message, args, client) {
        try {
            let random = Math.floor(Math.random() * 80);
            let url = ['https://www.reddit.com/r/showerthoughts.json?sort=rising&t=hour&limit=100'];

            request({
                method: 'GET',
                uri: url[Math.floor(Math.random() * url.length)]
            }, function (err, response, data) {
                if (err) {
                    return console.log(err, null);
                }

                data = JSON.parse(data);
                var mainObj = data.data.children;
                return message.channel.send({
                    embed: {
                        title: "Shower Thoughts",
                        description: `${mainObj[random].data.title}`,
                        color: "#8B0000",
                        footer: {
                            text: "Requested by " + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                });
            })
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
