const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const SteamAPI = require('steamapi');
const config = require('../../config.json');
const steam = new SteamAPI(config.steam);
const request = require('node-superfetch');

UserStatus = ["Offline", "Online", "Busy", "Away", "Snooze", "Looking to trade", "Looking to play"];
UserPriv = [" ", "Private / Friends Only", " ", "Public"]
module.exports = {
    name: 'steam',
    description: "Retrives steam profile details using their SteamID",
    aliases: ['steamuser'],
    usage: ' [steamID]',
    cooldown: 2,
    args: 1,
    catergory: 'Utility',
    async execute(message, args, client) {
        try {
            let SteamID = args[0];
            if (isNaN(SteamID)) {
                return message.reply("Please use a proper SteamID as the parameter");
            }

            let Found = false;
            await steam.getUserSummary(SteamID).then(summary => {
                var CreatedDate = new Date();
                CreatedDate.setTime(summary.created * 1000);
                let Created = CreatedDate.toUTCString();

                Found = true;
                return message.channel.send({
                    embed: {
                        title: `Steam Profile ( ${summary.nickname} )`,
                        description: "",
                        color: "#8B0000",
                        url: summary.url,
                        thumbnail: {
                            url: summary.avatar.large
                        },
                        fields: [
                            {
                                name: "• Status",
                                value: UserStatus[summary.personaState],
                                inline: true
                            },
                            {
                                name: "• Profile Visibility",
                                value: UserPriv[summary.visibilityState],
                                inline: true
                            },
                            {
                                name: "• Created",
                                value: "```" + Created + "```",
                            },],
                        footer: {
                            text: "Requested by " + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                });
            });

            if (!Found) {
                return message.channel.send({
                    embed: {
                        title: "Steam Profile",
                        description: `No user profile was found with the steamID of ${SteamID}`,
                        color: "#8B0000",
                        footer: {
                            text: "Requested by " + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                });
            }
        }
        catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
