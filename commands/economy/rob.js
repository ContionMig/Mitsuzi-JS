const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const {
    prefix,
    token,
    ownerid,
    logchannelid,
    giphy
} = require('../../config.json');

module.exports = {
    name: 'rob',
    description: "You can try to rob/mug someone. Be cautious as this may backfire!",
    aliases: ['steal', 'mug'],
    usage: ' [user]',
    cooldown: 10,
    args: 1,
    catergory: 'Economy',
    hidden: true,
    async execute(message, args, client) {
        try {
            let timeout = 43200000;

            let UserAttackScore = 1;
            let TargetAttackScore = 1;

            if (!message.mentions.members.first()) {
                return message.reply("Please tag the person you want to rob next time!");
            }

            let Target = message.mentions.members.first().user;
            if (message.author.id == Target.id) {
                return message.reply("Nice try, but you can't rob yourself!");
            }

            let CurrentTimeStamp = new Date().getTime();
            let UserTime = Util.NotNumberCheck(await db.get(`${message.author.id}_rob`));
            let TargetTime = Util.NotNumberCheck(await db.get(`${Target.id}_robbed`));
            if (!(((CurrentTimeStamp - UserTime) > timeout) || !UserTime)) {
                return message.channel.send({
                    embed: {
                        title: "Rob Cooldown",
                        description: `Hey hey, you are robbing users too fast, **slow it down** a bit! Please wait **${Util.msToTime(timeout - (CurrentTimeStamp - UserTime))}** for your cooldown to end`,
                        color: "#8B0000",
                        footer: {
                            text: "Requested by " + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                });
            }
            else if (!(((CurrentTimeStamp - TargetTime) > timeout) || !TargetTime)) {
                return message.channel.send({
                    embed: {
                        title: "Rob Cooldown",
                        description: `**Hey hey, the user which you are trying to rob has already been robbed in the past 12 hours, give him some slack!**`,
                        color: "#8B0000",
                        footer: {
                            text: "Requested by " + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                });
            }

            let UserCurrentBase = Util.NotNumberCheck(await db.get(`${message.author.id}_base`));
            let TargetCurrentBase = Util.NotNumberCheck(await db.get(`${Target.id}_base`));

            if (UserCurrentBase > -1) {
                UserAttackScore = Util.NotNumberCheck(await db.get(`${message.author.id}_defense`));
                UserAttackScore += Util.NotNumberCheck(await db.get(`${message.author.id}_basedefense`));
            }

            if (TargetCurrentBase > -1) {
                TargetAttackScore = Util.NotNumberCheck(await db.get(`${Target.id}_defense`));
                TargetAttackScore += Util.NotNumberCheck(await db.get(`${Target.id}_basedefense`));
            }

            db.set(`${message.author.id}_rob`, CurrentTimeStamp);
            db.set(`${Target.id}_robbed`, CurrentTimeStamp);

            let Chances = Math.floor((UserAttackScore / TargetAttackScore) * 100);
            let UserChances = Util.getRandomInt(1, 100);

            if (UserChances < Chances) {
                Chances = Util.getRandomInt(1, 5);
                let Message = '';
                switch (Chances) {
                    case 1:
                        let BailPrice = Util.getRandomInt(1, 5000);
                        let UserBalance = Util.NotNumberCheck(await db.get(`${message.author.id}_balance`));
                        if (BailPrice > UserBalance) {
                            BailPrice = UserBalance;
                        }
                        Message = `You tried to pickpocket him, but **failed**. You ended up in jail and paid **${Util.moneyFormat(BailPrice)}** for bail`;
                        db.subtract(`${message.author.id}_balance`, BailPrice);
                        break;
                    default:
                        let TargerBalance = Util.NotNumberCheck(await db.get(`${Target.id}_balance`));
                        if (TargerBalance < 250) {
                            Message = `You managed to pickpocket his wallet, but you saw how **broke** he was and felt **pity** and didn't take anything.`
                        }
                        else {
                            let Reward = Util.NotNumberCheck(Util.getRandomInt(1, TargerBalance));
                            Message = `You managed to pickpocket him and got his wallet. You took **${Util.moneyFormat(Reward)}** and made a run for it`

                            db.add(`${message.author.id}_balance`, parseInt(Reward));
                            db.subtract(`${Target.id}_balance`, parseInt(Reward));
                        }
                        break;
                }

                return message.channel.send({
                    embed: {
                        title: "Robbing",
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
            else {
                return message.channel.send({
                    embed: {
                        title: "Rob Failed",
                        description: `You tried to rob them but failed! Upgrade your base to get a better chance next time.`,
                        color: "#8B0000",
                        footer: {
                            text: "Requested by " + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                });
            }

        } catch (e) {
            console.error(e)
        }
    }
};
