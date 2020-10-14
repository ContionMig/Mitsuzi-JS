const fs = require('fs');
const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');

let subreddit = [
    "dankmemes",
    "memes",
    "wholesomememes",
    "2meirl4meirl",
    "memeeconomy"
];

module.exports = {
    name: 'postmeme',
    description: "Posts a meme in reddit and get coins using your karma",
    aliases: ['postmemes', 'pm'],
    usage: '',
    cooldown: 300,
    args: 0,
    catergory: 'Economy',
    async execute(message, args, client) {
        try {
            let Luck = Util.NotNumberCheck(await db.get(`${message.author.id}_luck`));
            Luck += Util.NotNumberCheck(await db.get(`${message.author.id}_baseluck`));

            let Message = "What type of meme would you like to post?\n\n`1` Dank Meme\n`2` Normal Meme\n`3` Wholesome Meme\n`4` 2me IRL 4me\n`5` Meme Template";
            message.channel.send({
                embed: {
                    title: "Post Memes",
                    description: Message,
                    color: "#8B0000",
                    footer: {
                        text: "Requested by " + message.author.tag,
                        icon_url: message.author.displayAvatarURL()
                    },
                    timestamp: new Date()
                }
            }).then(() => {
                message.channel.awaitMessages(response => ((response.author.id == message.author.id) && (Util.NotNumberCheck(response.content) > 0 || Util.NotNumberCheck(response.content) < 6)), {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                }).then((collected) => {
                    let NumberCheck = Util.NotNumberCheck(collected.first().content);
                    NumberCheck -= 1;

                    if (NumberCheck < 0 || NumberCheck > subreddit.length) {
                        NumberCheck = 1;
                    }

                    let RandomSubreddit = subreddit[NumberCheck];
                    let RandomPost = Math.floor(Math.random() * 80);

                    let rawdata = fs.readFileSync(`./include/assets/json/reddit/${RandomSubreddit}.json`);
                    data = JSON.parse(rawdata);
                    var mainObj = data.data.children[RandomPost].data;

                    let RandomReward = Math.floor(Math.random() * 3 + 5);
                    let Reward = Math.floor(mainObj.ups * (1 / RandomReward));

                    if (Luck > 0) {
                        Luck = (Reward / 100) * Luck;
                    }

                    Reward += Luck;
                    db.add(`${message.author.id}_balance`, Reward);
                    return message.channel.send({
                        embed: {
                            title: "You Posted Your Awesome Meme!",
                            thumbnail: {
                                url: mainObj.url,
                            },
                            description: `You posted a meme in **r/${RandomSubreddit}** and titled it **${mainObj.title}**`,
                            fields: [
                                {
                                    name: '**Rewards:**',
                                    value: `**Upvotes:** ${mainObj.ups}\n**Rewards:** ${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})`,
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

                }).catch((err) => {
                    if (err) { console.log(err); }
                    return message.reply('Please choose a meme type you like to post next time!');
                });
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
