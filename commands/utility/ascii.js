const Util = require('../../util/MitUtil.js');
var asciify = require('asciify-image');
var validUrl = require('valid-url');

module.exports = {
    name: 'ascii',
    description: 'Turns the url image to an ascii',
    aliases: ['asciify'],
    usage: ' [imageurl]',
    cooldown: 10,
    args: 1,
    catergory: 'Utility',
    async execute(message, args, client) {
        try {
            var options = {
                fit: 'box',
                width: 40,
                height: 30,
                color: false
            }

            let URL = args[0];
            if (validUrl.isUri(URL)) {
                asciify(URL, options)
                    .then(function (asciified) {
                        message.channel.send("```" + asciified + "```");
                    })
                    .catch(function (err) {
                        // Print error to console
                        console.error(err);
                        return message.reply("Something went wrong! Make sure the URL is valid");
                    });
            }
            else {
                return message.reply("Something went wrong! Make sure the URL is valid");
            }
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
