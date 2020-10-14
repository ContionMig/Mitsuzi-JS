const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
let price = require('crypto-price');

module.exports = {
    name: 'crypto',
    description: "Gets the price of the crypto-currency",
    aliases: [],
    usage: ' [crypto]',
    cooldown: 2,
    args: 0,
    catergory: 'Others',
    async execute(message, args, client) {
        try {
            if (args.length) {
                let Crypto = args[0];
                price.getCryptoPrice("USD", Crypto).then(obj => { // Base for ex - USD, Crypto for ex - ETH 
                    return message.channel.send({
                        embed: {
                            title: "Crypto Price",
                            fields: [{
                                name: `• ${Crypto}`,
                                value: `USD ${Util.moneyFormat(obj.price)}`,
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
                }).catch(err => {
                    console.log(err);
                    return message.reply("Crypto entered is either invalid or not supported")
                })
            }

            let Ethereum = 0;
            let Bitcoin = 0;
            let Litecoin = 0;
            let Monero = 0;
            let Ripple = 0;
            let ZCash = 0;

            await price.getCryptoPrice("USD", "ETH").then(obj => { // Base for ex - USD, Crypto for ex - ETH 
                Ethereum = obj.price;
            }).catch(err => {
                console.log(err);
                return message.reply("Something went wrong!");
            })

            await price.getCryptoPrice("USD", "BTC").then(obj => { // Base for ex - USD, Crypto for ex - ETH 
                Bitcoin = obj.price;
            }).catch(err => {
                console.log(err);
                return message.reply("Something went wrong!");
            })

            await price.getCryptoPrice("USD", "LTC").then(obj => { // Base for ex - USD, Crypto for ex - ETH 
                Litecoin = obj.price;
            }).catch(err => {
                console.log(err);
                return message.reply("Something went wrong!");
            })

            await price.getCryptoPrice("USD", "XMR").then(obj => { // Base for ex - USD, Crypto for ex - ETH 
                Monero = obj.price;
            }).catch(err => {
                console.log(err);
                return message.reply("Something went wrong!");
            })

            await price.getCryptoPrice("USD", "XRP").then(obj => { // Base for ex - USD, Crypto for ex - ETH 
                Ripple = obj.price;
            }).catch(err => {
                console.log(err);
                return message.reply("Something went wrong!");
            })

            await price.getCryptoPrice("USD", "ZEC").then(obj => { // Base for ex - USD, Crypto for ex - ETH 
                ZCash = obj.price;
            }).catch(err => {
                console.log(err);
                return message.reply("Something went wrong!");
            })

            return message.channel.send({
                embed: {
                    title: "Crypto Price",
                    fields: [{
                        name: `• Ethereum`,
                        value: `USD ${Util.moneyFormat(Ethereum)}`,
                        inline: true,
                    },
                    {
                        name: `• Bitcoin`,
                        value: `USD ${Util.moneyFormat(Bitcoin)}`,
                        inline: true,
                    },
                    {
                        name: `• Litecoin`,
                        value: `USD ${Util.moneyFormat(Litecoin)}`,
                        inline: true,
                    },
                    {
                        name: `• Monero`,
                        value: `USD ${Util.moneyFormat(Monero)}`,
                        inline: true,
                    },
                    {
                        name: `• Ripple`,
                        value: `USD ${Util.moneyFormat(Ripple)}`,
                        inline: true,
                    },
                    {
                        name: `• ZCash`,
                        value: `USD ${Util.moneyFormat(ZCash)}`,
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
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
