const Util = require('../../util/MitUtil.js');
const DabiImages = require("dabi-images");
const DabiClient = new DabiImages.Client();

module.exports = {
    name: 'panties',
    description: "Sends a random panty related images",
    aliases: ['panty', 'underwear'],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'NSFW',
    async execute(message, args, client) {
        try {
            if (message.channel.nsfw == true) {
                await DabiClient.nsfw.real.panties().then(json => {
                    return message.channel.send({
                        embed: {
                            title: "NSFW Machine",
                            image: {
                                url: json.url,
                            },
                            color: "#8B0000",
                            footer: {
                                text: "Requested by " + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                    // outputs data with image url, possible source and other stuff
                }).catch(error => {
                    console.log(error);
                    return message.reply("Uknown error, please try again");
                    // outputs error
                });

            } else {
                return message.reply("This isn't NSFW channel!");
            }
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
