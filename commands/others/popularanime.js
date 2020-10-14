const Util = require('../../util/MitUtil.js');
const request = require('node-superfetch');
const api = require('animefreak');
const { isNullOrUndefined, isArray } = require('util');

module.exports = {
    name: 'popularanime',
    description: "Replies with a popular anime",
    aliases: ['pa'],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'Others',
    async execute(message, args, client) {
        try {
            let OnGoing = await api.popular();
            let Random = OnGoing[Math.floor(Math.random() * OnGoing.length)]

            let Title = Random.title;
            let Message = Random.synopsis;
            if (Message === null || Message === undefined) {
                Message = "None";
            }

            let Rating = Random.rating;
            if (Rating === null || Rating === undefined) {
                Rating = "None";
            }

            let Status = Random.status;
            if (Status === null || Status === undefined) {
                Status = "None";
            }

            let Type = Random.type;
            if (Type === null || Type === undefined) {
                Type = "None";
            }

            let FirstAired = Random.firstAired;
            if (FirstAired === null || FirstAired == 'undefined') {
                FirstAired = "None";
            }

            let TotalEP = Random.totalEps;
            if (TotalEP === null || TotalEP === undefined) {
                TotalEP = "None";
            }

            let IMG = Random.img;
            if (IMG === null || IMG === undefined) {
                IMG = "None";
            }

            let Genres = Random.genres;
            if (Genres === null || Genres === undefined) {
                Genres = "None";
            }

            if (Rating == "Ongoing") {
                Rating = "None";
                Status = Random.rating;
                Type = Random.status;
                FirstAired = Random.type;
            }

            return message.channel.send({
                embed: {
                    title: Title,
                    description: Message,
                    image: {
                        url: IMG,
                    },
                    fields: [
                        {
                            name: '• Genres',
                            value: Genres,
                            inline: true,
                        },
                        {
                            name: '• First Aired',
                            value: FirstAired,
                            inline: true,
                        },
                        {
                            name: '• Type',
                            value: Type,
                            inline: true,
                        },
                        {
                            name: '• Status',
                            value: Status,
                            inline: true,
                        },
                        {
                            name: '• Rating',
                            value: Rating,
                            inline: true,
                        },
                        {
                            name: '• Total EPs',
                            value: TotalEP,
                            inline: true,
                        },
                    ],
                    color: "#8B0000",
                    footer: {
                        text: "Requested by " + message.author.tag,
                        icon_url: message.author.displayAvatarURL()
                    },
                    timestamp: new Date()
                }
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
