const Util = require('../../util/MitUtil.js');
const request = require("request");
const proxy = require('proxy-list-random');
var randomnumber = require('random-number');

module.exports = {
    name: 'proxylist',
    description: "Sends a llist of proxies ( updates every hour )",
    aliases: ['proxy'],
    usage: '',
    cooldown: 10,
    args: 0,
    catergory: 'Others',
    async execute(message, args, client) {
        await proxy().then(res => {
            var obj = res.split(",");
            var options = { min: 0, max: (obj.length - 40), integer: true }
            let RandomRange = randomnumber(options);

            let Message = "```";
            for (let i = RandomRange; i < (RandomRange + 40); i++) {
                let Stripped = obj[i].replace("[32m'", "");
                Stripped = Stripped.replace("'[39m", "");
                Stripped = Stripped.replace("[", "");
                Stripped = Stripped.replace("]", "");
                Stripped = Stripped.replace(/(\r\n|\n|\r)/gm,"");
                Stripped = Stripped.replace(/ /g,'');

                Message += Stripped + "\n";
            }
            Message += "```";
            return message.channel.send({
                embed: {
                    title: "Proxy List",
                    description: Message,
                    color: "#8B0000",
                    footer: {
                        text: "Requested by " + message.author.tag,
                        icon_url: message.author.displayAvatarURL()
                    },
                    timestamp: new Date()
                }
            });
        });

        return messasge.reply('Something went wrong, pelase try again');
    }
};
