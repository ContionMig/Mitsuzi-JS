const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const { ownerid } = require('../../config.json');
const fs = require('fs');

let rawdata = fs.readFileSync('./include/assets/json/reddit.json');
let Game = JSON.parse(rawdata);

var Crawler = require("crawler");

module.exports = {
    name: 'refreshreddit',
    description: "[OWNER] Refreshes the current saves json reddit",
    aliases: ['refreshpm', 'rpm', 'redditrefresh'],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'Utility',
    hidden: true,
    async execute(message, args, client) {
        try {
            if (message.author.id !== ownerid) return;

            let Subreddits = Game["subreddits"];

            var c = new Crawler({
                encoding: null,
                jQuery: false,// set false to suppress warning message.
                callback: function (err, res, done) {
                    if (err) {
                        console.error(err.stack);
                    } else {
                        fs.createWriteStream(res.options.filename).write(res.body);
                    }

                    done();
                }
            });

            for (let i = 0; i < Subreddits.length; i++) {
                c.queue({
                    uri: `https://www.reddit.com/r/${Subreddits[i]}/.json?sort=rising&t=hour&limit=80`,
                    filename: `./include/assets/json/reddit/${Subreddits[i]}.json`
                });
            }

            return message.channel.send({
                embed: {
                    title: "[Owner] Refreshed Subreddits",
                    color: "#8B0000",
                    footer: {
                        text: "Requested by " + message.author.tag,
                        icon_url: message.author.displayAvatarURL()
                    },
                    timestamp: new Date()
                }
            });

        } catch (e) {
            console.error(e)
        }
    }
};
