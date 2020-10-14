const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
var rAnimal = require("random-animal-name");
const fs = require('fs');

let BodyPart = [`knee`, `thumb`, `hip`, `finger`, `buttocks`, `groin`, `lower leg`, `ribs`, `elbow`, `back`, `pinky finger`, `breast`, `ankle`, `neck`, `calves`, `toes`, `forearm`, `chest`, `big toe`, `mouth`, `wrist`, `scalp`, `shoulder blade`, `chin`, `ear`, `kidney`, `hand`, `humerus`, `upper arm`, `waist`, `bottom`, `jaw`, `forehead`, `feet`, `hair`, `eyelashes`, `legs`, `teeth`, `face`, `heel`, `throat`, `collar bone`, `index finger`, `cheek`, `testes`, `eyelid`, `arm`, `fingernail`, `foot`, `nipple`, `teeth`, `shin`, `thigh`, `ear lobe`, `abdomen`, `spine`, `fist`, `shoulder`, `belly`, `toenail`, `palm`, `lips`, `nose`, `gums`]

module.exports = {
    name: 'search',
    description: "Searches around places/things to find spare cash",
    aliases: ['sch'],
    usage: '',
    cooldown: 30,
    args: 0,
    catergory: 'Economy',
    async execute(message, args, client) {
        try {
            let rawdata = await fs.readFileSync('./include/assets/json/game.json');
            let Game = JSON.parse(rawdata);

            let searchLocation = Game.data["searchLocation"];
            let RandomSearchLocation = [];
            
            RandomSearchLocation = Util.shuffle(searchLocation).slice(0,3);

            let Luck = Util.NotNumberCheck(await db.get(`${message.author.id}_luck`));
            Luck += Util.NotNumberCheck(await db.get(`${message.author.id}_baseluck`));
            let Balance = parseInt(await db.get(`${message.author.id}_balance`));
            
            let Message = "Where do you want to search?\nPick from the list below and type it in chat.\n\n``" + RandomSearchLocation[0] + "`` ``" + RandomSearchLocation[1] + "`` ``" + RandomSearchLocation[2] + "``"
            message.channel.send({
                embed: {
                    title: "Search Machine",
                    description: Message,
                    color: "#8B0000",
                    footer: {
                        text: "Requested by " + message.author.tag,
                        icon_url: message.author.displayAvatarURL()
                    },
                    timestamp: new Date()
                }
            }).then(() => {
                message.channel.awaitMessages(response => (response.author.id == message.author.id) && ((RandomSearchLocation.indexOf(response.content.toLowerCase())) > -1), {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                }).then((collected) => {
                    let Chances = Math.round(Math.random() * 12);
                    let EndMessage = "";

                    let Lose = Math.round(Math.random() * (Balance / 100 * 10)) + 1;
                    if (Lose > Balance) {
                        Lose = Balance;
                    }

                    let Reward = Math.round(Math.random() * 1000) + 1;
                    
                    if (Luck > 0) {
                        Chances += Math.round(Luck / 100);
                        Luck = (Reward / 100) * Luck;
                    }

                    Reward += Luck;
                    switch (Chances) {
                        case 1:
                            db.subtract(`${message.author.id}_balance`, Lose);
                            EndMessage = `You got caught! You paid a cop **${Util.moneyFormat(Lose)}** to stay out of prison. Next time don't try and break into things you dumb dumb.`;
                            break;
                        case 2:
                            const member = message.guild.members.cache.random(1)[0].user;
                            db.add(`${message.author.id}_balance`, Math.round(Reward / 2));
                            db.add(`${member.id}_balance`, Math.round(Reward / 2));
                            EndMessage = `You managed to find **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**. However, there was a withness ( ${member.username} ), so you gave him 50% to keep him quiet.`;
                            break;
                        case 3:
                            EndMessage = `You saw **${Util.moneyFormat(Reward- Luck)} +(${Util.moneyFormat(Luck)})** and tried to reach down to grab it, but you broke your **${BodyPart[Math.floor(Math.random() * BodyPart.length)]}** and went to the hospital. Luckily, you had insurance, so you didn't have to pay anything.`;
                            break;
                        case 4:
                            let RandomChance = Math.round(Math.random() * 100);
                            db.add(`${message.author.id}_balance`, Math.round(Reward / 100 * (100 - RandomChance)));
                            EndMessage = `You managed to find **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**. After grabbing it, all of a sudden a **${rAnimal()}** ran towards you and ate **${RandomChance}%** of the money you found.`;
                            break;
                        default:
                            db.add(`${message.author.id}_balance`, Math.round(Reward));
                            EndMessage = `You managed to find **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**. You quickly grabbed it and placed it in your pockets.`;
                            break;
                    }

                    return message.channel.send({
                        embed: {
                            title: "Place Searched",
                            description: EndMessage,
                            color: "#8B0000",
                            footer: {
                                text: "Requested by " + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                }).catch((err) => {
                    return message.reply('Please choose a place you would like to search for next time!');
                });
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};

