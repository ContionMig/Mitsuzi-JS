const Util = require('../../util/MitUtil.js');
const status = require('minecraft-server-status');
const { Server } = require('http');

module.exports = {
    name: 'minecraftserver',
    description: "The bot will reply with the status of the server given and give more details on the server",
    aliases: ['minecraftstatus'],
    usage: ' [ip:port]',
    cooldown: 2,
    args: 1,
    catergory: 'Utility',
    async execute(message, args, client) {
        try {
            let Whole = args[0];
            let Split = Whole.split(":");

            let Port = 25565;
            if (Split.length == 2) {
                Port = parseInt(Split[1]);
            }

            status(Split[0], Port, response => {
                if (response.online) {
                    let Uptime = Util.msToTime(response.duration);
                    return message.channel.send({
                        embed: {
                            title: "Minecraft Server Machine",
                            description: response.server.name,
                            fields: [{
                                name: '• MOTD',
                                value: response.motd,
                                inline: true,
                            },
                            {
                                name: '• Players',
                                value: `${response.players.now}/${response.players.max}`,
                                inline: true,
                            },
                            {
                                name: '• Last Online',
                                value: `${Util.timeConverter(response.last_online)}`,
                                inline: true,
                            },
                            {
                                name: '• Last Updated',
                                value: `${Util.timeConverter(response.last_updated)}`,
                                inline: true,
                            },
                            {
                                name: '• Uptime',
                                value: `${Uptime}`,
                                inline: true,
                            }],
                            color: "#8B0000",
                            footer: {
                                text: "Requested by " + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                }
                else {
                    message.reply("Server seems to be down, please make sure the server is up!");
                }
            })

        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
