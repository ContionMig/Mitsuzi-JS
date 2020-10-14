const Util = require('../../util/MitUtil.js');
var PastebinAPI = require('pastebin-js');
const Config = require('../../config.json');

module.exports = {
    name: 'pastebin',
    description: 'Creates a pastebin post using the text provided',
    aliases: ['pb'],
    usage: ' [message]',
    cooldown: 30,
    args: -1,
    catergory: 'Utility',
    async execute(message, args, client) {
        try {
            var pastebinob = new PastebinAPI({
                'api_dev_key': Config.pastebin[0],
                'api_user_name': Config.pastebin[1],
                'api_user_password': Config.pastebin[2]
            });

            pastebinob.createPaste({
                    text: args.join(" "),
                    title: "Requested by " + message.author.tag,
                    format: null,
                    privacy: 3,
                    expiration: 'N'
                })
                .then(function (data) {

                    return message.channel.send({
                        embed: {
                          title: "Posted To Pastebin",
                          url: data,
                          color: "#8B0000",
                          footer: {
                            text: "Requested by " + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                          },
                          timestamp: new Date()
                        }
                      });
                })
                .fail(function (err) {
                    console.log(err);
                    return message.reply(`Oh no, an error occurred. Try again later!`);
                })

        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
