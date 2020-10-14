const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const config = require('../../config.json');
const osu = require('node-osu');
const osuApi = new osu.Api(config.osu, {
    // baseUrl: sets the base api url (default: https://osu.ppy.sh/api)
    notFoundAsError: true, // Throw an error on not found instead of returning nothing. (default: true)
    completeScores: false, // When fetching scores also fetch the beatmap they are for (Allows getting accuracy) (default: false)
    parseNumeric: false // Parse numeric values into numbers/floats, excluding ids
});

module.exports = {
    name: 'osu',
    description: "Retrives a beatmap or user information from OSU!",
    aliases: ['beatmap'],
    usage: ' [user/beatmap] [name]',
    cooldown: 2,
    args: 2,
    catergory: 'Utility',
    async execute(message, args, client) {
        try {
            let SearchType = args[0].toLowerCase();
            let Search = args[1];

            let Found = false;
            let Message = `No user profile or beatmap was found`;
            if (SearchType == "u" || SearchType == "user") {
                await osuApi.getUser({ u: Search }).then(user => {
                    Found = true;
                    return message.channel.send({
                        embed: {
                            title: "OSU Machine",
                            thumbnail: {
                                url: "https://screenshots.gamebanana.com/img/ico/sprays/50c558c73582a.png"
                            },
                            fields: [{
                                name: '• About',
                                value: "**ID:** ``" + user.id + "``\n" + "**Name:** ``" + user.name + "``\n" + "**Country:** ``" + user.country + "``",
                                inline: true,
                            },
                            {
                                name: '• Scores',
                                value: "**Ranked:** ``" + user.scores.ranked + "``\n" + "**Total:** ``" + user.scores.total + "``",
                                inline: true,
                            },
                            {
                                name: '• PP',
                                value: "**Raw:** ``" + user.pp.raw + "``\n" + "**Rank:** ``" + user.pp.rank + "``\n" + "**Country Rank:** ``" + user.pp.countryRank + "``",
                                inline: true,
                            },
                            {
                                name: '• Performance',
                                value: "**Total Plays:** ``" + user.counts.plays + "``\n" + "**Level:** ``" + user.level + "``\n" + "**Accuracy:** ``" + user.accuracy + "``",
                                inline: true,
                            }
                            ],
                            color: "#8B0000",
                            footer: {
                                text: "Requested by " + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                });
            }
            else if (SearchType == "b" || SearchType == "beatmap") {
                await osuApi.getBeatmaps({ b: Search }).then(beatmaps => {
                    Found = true;
                    return message.channel.send({
                        embed: {
                            title: "OSU Machine",
                            thumbnail: {
                                url: "https://screenshots.gamebanana.com/img/ico/sprays/50c558c73582a.png"
                            },
                            description: `**Max Combo: ${beatmaps[0].maxCombo}**`,
                            fields: [{
                                name: '• About',
                                value: "**Creator:** ``" + beatmaps[0].creator + "``\n" + "**Name:** ``" + beatmaps[0].title + "``\n" + "**BPM:** ``" + beatmaps[0].bpm + "``\n" + "**Artist:** ``" + beatmaps[0].artist + "``",
                            },
                            {
                                name: '• Objects',
                                value: "**Circles:** ``" + beatmaps[0].objects.normal + "``\n" + "**Sliders:** ``" + beatmaps[0].objects.slider + "``\n" + "**Spinners:** ``" + beatmaps[0].objects.spinner + "``",
                            },
                            {
                                name: '• Difficulty',
                                value: "**Rating:** ``" + beatmaps[0].difficulty.rating + "``\n" + "**Aim:** ``" + beatmaps[0].difficulty.aim + "``\n" + "**Speed:** ``" + beatmaps[0].difficulty.speed + "``\n" + "**Size:** ``" + beatmaps[0].difficulty.size + "``\n",
                            },
                            {
                                name: '• Others',
                                value: "**Approval Status:** ``" + beatmaps[0].approvalStatus + "``\n" + "**Plays:** ``" + beatmaps[0].counts.plays + "``\n" + "**Passes:** ``" + beatmaps[0].counts.passes + "``\n",
                            }
                            ],
                            color: "#8B0000",
                            footer: {
                                text: "Requested by " + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                });
            }

            if (!Found) {
                return message.channel.send({
                    embed: {
                        title: "OSU Machine",
                        thumbnail: {
                            url: "https://screenshots.gamebanana.com/img/ico/sprays/50c558c73582a.png"
                        },
                        description: Message,
                        color: "#8B0000",
                        footer: {
                            text: "Requested by " + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                });
            }
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
